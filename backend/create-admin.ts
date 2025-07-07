import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/User';
import dotenv from 'dotenv';

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/peluqueria');
    console.log('Conectado a MongoDB');

    // Verificar si ya existe el admin moestilos
    const existingAdmin = await User.findOne({ email: 'moestilos@admin.com' });
    if (existingAdmin) {
      console.log('El admin moestilos ya existe');
      mongoose.disconnect();
      return;
    }

    const salt = await bcrypt.genSalt(10);

    const admin = new User({
      nombre: 'Administrador Principal',
      email: 'moestilos@admin.com',
      password: await bcrypt.hash('123321', salt),
      telefono: '+1234567999',
      rol: 'admin'
    });

    await admin.save();
    console.log('Admin moestilos creado exitosamente');
    console.log('Usuario: moestilos@admin.com');
    console.log('Contraseña: 123321');

    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    mongoose.disconnect();
  }
}

createAdmin();
