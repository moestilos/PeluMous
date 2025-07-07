import { Request, Response } from 'express';
import Appointment from '../models/Appointment';
import Service from '../models/Service';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: any;
}

export const createAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { peluquero, servicio, fecha, horaInicio, notas } = req.body;

    // Verificar que el servicio existe
    const serviceDoc = await Service.findById(servicio);
    if (!serviceDoc) {
      res.status(404).json({ message: 'Servicio no encontrado' });
      return;
    }

    // Verificar que el peluquero existe
    const peluqueroDoc = await User.findById(peluquero);
    if (!peluqueroDoc || peluqueroDoc.rol !== 'peluquero') {
      res.status(404).json({ message: 'Peluquero no encontrado' });
      return;
    }

    // Calcular hora fin basada en la duración del servicio
    const [hora, minutos] = horaInicio.split(':').map(Number);
    const inicioMinutos = hora * 60 + minutos;
    const finMinutos = inicioMinutos + serviceDoc.duracion;
    const horaFin = `${Math.floor(finMinutos / 60).toString().padStart(2, '0')}:${(finMinutos % 60).toString().padStart(2, '0')}`;

    // Verificar disponibilidad
    const fechaInicio = new Date(fecha);
    const conflicto = await Appointment.findOne({
      peluquero,
      fecha: fechaInicio,
      estado: { $in: ['pendiente', 'confirmada'] },
      $or: [
        {
          horaInicio: { $lte: horaInicio },
          horaFin: { $gt: horaInicio }
        },
        {
          horaInicio: { $lt: horaFin },
          horaFin: { $gte: horaFin }
        }
      ]
    });

    if (conflicto) {
      res.status(400).json({ message: 'El horario no está disponible' });
      return;
    }

    const appointment = new Appointment({
      cliente: req.user._id,
      peluquero,
      servicio,
      fecha: fechaInicio,
      horaInicio,
      horaFin,
      notas,
      precio: serviceDoc.precio
    });

    await appointment.save();

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('cliente', 'nombre email telefono')
      .populate('peluquero', 'nombre')
      .populate('servicio', 'nombre precio duracion');

    res.status(201).json({
      message: 'Cita creada correctamente',
      appointment: populatedAppointment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const getAppointments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let filter: any = {};

    // Si es cliente, solo ver sus citas
    if (req.user.rol === 'cliente') {
      filter.cliente = req.user._id;
    }
    // Si es peluquero, ver citas asignadas a él
    else if (req.user.rol === 'peluquero') {
      filter.peluquero = req.user._id;
    }
    // Admin puede ver todas las citas

    const appointments = await Appointment.find(filter)
      .populate('cliente', 'nombre email telefono')
      .populate('peluquero', 'nombre')
      .populate('servicio', 'nombre precio duracion')
      .sort({ fecha: 1, horaInicio: 1 });

    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const updateAppointmentStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { estado, notas } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      res.status(404).json({ message: 'Cita no encontrada' });
      return;
    }

    // Solo el peluquero asignado o admin pueden cambiar el estado
    if (req.user.rol !== 'admin' && appointment.peluquero.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: 'No tienes permisos para modificar esta cita' });
      return;
    }

    appointment.estado = estado;
    if (notas !== undefined) {
      appointment.notas = notas;
    }
    await appointment.save();

    const updatedAppointment = await Appointment.findById(id)
      .populate('cliente', 'nombre email telefono')
      .populate('peluquero', 'nombre')
      .populate('servicio', 'nombre precio duracion');

    res.json({
      message: 'Estado de la cita actualizado',
      appointment: updatedAppointment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const deleteAppointment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      res.status(404).json({ message: 'Cita no encontrada' });
      return;
    }

    // Solo el cliente que creó la cita o admin pueden eliminarla
    if (req.user.rol !== 'admin' && appointment.cliente.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: 'No tienes permisos para eliminar esta cita' });
      return;
    }

    await Appointment.findByIdAndDelete(id);

    res.json({ message: 'Cita eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const getHairdresserAppointments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Verificar que el usuario es peluquero
    if (req.user.rol !== 'peluquero') {
      res.status(403).json({ message: 'Solo los peluqueros pueden acceder a esta función' });
      return;
    }

    const appointments = await Appointment.find({ peluquero: req.user._id })
      .populate('cliente', 'nombre email telefono')
      .populate('peluquero', 'nombre')
      .populate('servicio', 'nombre precio duracion')
      .sort({ fecha: 1, horaInicio: 1 });

    // Formatear las citas para el frontend
    const formattedAppointments = appointments.map(appointment => {
      // Combinar fecha y hora en un formato DateTime
      const dateTime = new Date(appointment.fecha);
      const [hora, minutos] = appointment.horaInicio.split(':');
      dateTime.setHours(parseInt(hora), parseInt(minutos), 0, 0);

      return {
        _id: appointment._id,
        client: {
          name: (appointment.cliente as any).nombre,
          email: (appointment.cliente as any).email,
          phone: (appointment.cliente as any).telefono
        },
        service: {
          name: (appointment.servicio as any).nombre,
          duration: (appointment.servicio as any).duracion,
          price: (appointment.servicio as any).precio
        },
        hairdresser: {
          name: (appointment.peluquero as any).nombre
        },
        dateTime: dateTime.toISOString(),
        status: appointment.estado,
        notes: appointment.notas
      };
    });

    res.json(formattedAppointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};
