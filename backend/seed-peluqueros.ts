import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/User';
import dotenv from 'dotenv';

dotenv.config();

async function seedPeluqueros() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/peluqueria');
    console.log('Conectado a MongoDB');

    // Verificar si ya existen peluqueros
    const existingPeluqueros = await User.find({ rol: 'peluquero' });
    if (existingPeluqueros.length > 0) {
      console.log('Ya existen peluqueros en la base de datos');
      return;
    }

    const salt = await bcrypt.genSalt(10);

    const peluqueros = [
      {
        nombre: 'María García',
        email: 'maria@peluqueria.com',
        password: await bcrypt.hash('123456', salt),
        telefono: '+1234567801',
        rol: 'peluquero'
      },
      {
        nombre: 'Carlos López',
        email: 'carlos@peluqueria.com',
        password: await bcrypt.hash('123456', salt),
        telefono: '+1234567802',
        rol: 'peluquero'
      },
      {
        nombre: 'Ana Martínez',
        email: 'ana@peluqueria.com',
        password: await bcrypt.hash('123456', salt),
        telefono: '+1234567803',
        rol: 'peluquero'
      }
    ];

    await User.insertMany(peluqueros);
    console.log('Peluqueros creados exitosamente');

    // Crear un admin también
    const existingAdmin = await User.findOne({ rol: 'admin' });
    if (!existingAdmin) {
      const admin = new User({
        nombre: 'Administrador',
        email: 'admin@peluqueria.com',
        password: await bcrypt.hash('admin123', salt),
        telefono: '+1234567800',
        rol: 'admin'
      });
      await admin.save();
      console.log('Administrador creado exitosamente');
    }

    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    mongoose.disconnect();
  }
}

seedPeluqueros();
