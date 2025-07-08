import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/User';

const createTestClient = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/peluqueria');
    console.log('Conectado a MongoDB en', process.env.MONGODB_URI || 'mongodb://localhost:27017/peluqueria');

    // Crear usuario cliente de prueba
    const hashedPassword = await bcrypt.hash('123456', 10);
    const client = await User.findOneAndUpdate(
      { email: 'cliente@test.com' },
      {
        nombre: 'Ana López',
        email: 'cliente@test.com',
        telefono: '123456789',
        password: hashedPassword,
        rol: 'cliente',
        activo: true
      },
      { upsert: true, new: true }
    );

    console.log('Cliente creado:', client.email);
    console.log('Contraseña: 123456');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createTestClient();
