import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/User';
import Service from './src/models/Service';
import Appointment from './src/models/Appointment';

const createTestData = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/peluqueria');
    console.log('Conectado a MongoDB');

    // Crear usuario peluquero de prueba
    const hashedPassword = await bcrypt.hash('123456', 10);
    const peluquero = await User.findOneAndUpdate(
      { email: 'peluquero@test.com' },
      {
        nombre: 'Carlos Estilista',
        email: 'peluquero@test.com',
        telefono: '654321987',
        password: hashedPassword,
        rol: 'peluquero',
        activo: true,
        especialidades: ['Corte', 'Coloración', 'Peinados']
      },
      { upsert: true, new: true }
    );

    console.log('Peluquero creado:', peluquero.email);

    // Buscar servicios existentes
    const services = await Service.find().limit(3);
    if (services.length === 0) {
      console.log('No hay servicios en la base de datos. Ejecuta primero el seeder de servicios.');
      return;
    }

    // Buscar clientes existentes
    const clients = await User.find({ rol: 'cliente' }).limit(2);
    if (clients.length === 0) {
      console.log('No hay clientes en la base de datos. Registra algunos clientes primero.');
      return;
    }

    // Crear algunas citas de ejemplo para el peluquero
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

    const appointments = [
      {
        cliente: clients[0]._id,
        peluquero: peluquero._id,
        servicio: services[0]._id,
        fecha: tomorrow,
        horaInicio: '10:00',
        horaFin: '11:00',
        estado: 'pendiente',
        notas: 'Cliente nuevo, primera vez',
        precio: services[0].precio
      },
      {
        cliente: clients[1]._id,
        peluquero: peluquero._id,
        servicio: services[1]._id,
        fecha: tomorrow,
        horaInicio: '14:30',
        horaFin: '15:30',
        estado: 'confirmada',
        notas: 'Cliente habitual',
        precio: services[1].precio
      },
      {
        cliente: clients[0]._id,
        peluquero: peluquero._id,
        servicio: services[2]._id,
        fecha: dayAfterTomorrow,
        horaInicio: '16:00',
        horaFin: '17:00',
        estado: 'pendiente',
        precio: services[2].precio
      }
    ];

    // Eliminar citas existentes del peluquero para evitar duplicados
    await Appointment.deleteMany({ peluquero: peluquero._id });

    // Crear las nuevas citas
    for (const appointmentData of appointments) {
      const appointment = new Appointment(appointmentData);
      await appointment.save();
      console.log(`Cita creada: ${appointmentData.horaInicio} el ${appointmentData.fecha.toDateString()}`);
    }

    console.log('✅ Datos de prueba creados exitosamente');
    console.log('📧 Email del peluquero: peluquero@test.com');
    console.log('🔑 Contraseña: 123456');
    console.log('🏠 Puedes iniciar sesión y acceder al Panel Peluquero desde el Dashboard');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
};

createTestData();
