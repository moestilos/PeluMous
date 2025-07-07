import { Request, Response } from 'express';
import Service from '../models/Service';

export const getServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const services = await Service.find({ activo: true });
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const createService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nombre, descripcion, precio, duracion, categoria } = req.body;

    const service = new Service({
      nombre,
      descripcion,
      precio,
      duracion,
      categoria
    });

    await service.save();

    res.status(201).json({
      message: 'Servicio creado correctamente',
      service
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const updateService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const service = await Service.findByIdAndUpdate(id, updates, { new: true });

    if (!service) {
      res.status(404).json({ message: 'Servicio no encontrado' });
      return;
    }

    res.json({
      message: 'Servicio actualizado correctamente',
      service
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

export const deleteService = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const service = await Service.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true }
    );

    if (!service) {
      res.status(404).json({ message: 'Servicio no encontrado' });
      return;
    }

    res.json({ message: 'Servicio desactivado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};
