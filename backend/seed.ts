import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './src/models/User';
import Service from './src/models/Service';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/peluqueria');

    // Limpiar base de datos
    await User.deleteMany({});
    await Service.deleteMany({});

    // Crear usuarios de ejemplo
    const salt = await bcrypt.genSalt(10);
    
    const admin = new User({
      nombre: 'Admin Principal',
      email: 'admin@peluqueria.com',
      password: await bcrypt.hash('admin123', salt),
      telefono: '123456789',
      rol: 'admin'
    });

    const peluquero1 = new User({
      nombre: 'María García',
      email: 'maria@peluqueria.com',
      password: await bcrypt.hash('maria123', salt),
      telefono: '987654321',
      rol: 'peluquero'
    });

    const peluquero2 = new User({
      nombre: 'Juan Pérez',
      email: 'juan@peluqueria.com',
      password: await bcrypt.hash('juan123', salt),
      telefono: '456789123',
      rol: 'peluquero'
    });

    const cliente = new User({
      nombre: 'Cliente Ejemplo',
      email: 'cliente@ejemplo.com',
      password: await bcrypt.hash('cliente123', salt),
      telefono: '789123456',
      rol: 'cliente'
    });

    await admin.save();
    await peluquero1.save();
    await peluquero2.save();
    await cliente.save();

    // Crear servicios de ejemplo
    const servicios = [
      {
        nombre: 'Corte de Cabello',
        descripcion: 'Corte profesional adaptado a tu estilo',
        precio: 25,
        duracion: 30,
        categoria: 'corte'
      },
      {
        nombre: 'Lavado + Corte',
        descripcion: 'Lavado con productos premium y corte profesional',
        precio: 35,
        duracion: 45,
        categoria: 'corte'
      },
      {
        nombre: 'Tinte Completo',
        descripcion: 'Coloración completa del cabello',
        precio: 60,
        duracion: 120,
        categoria: 'tinte'
      },
      {
        nombre: 'Peinado para Eventos',
        descripcion: 'Peinado elegante para ocasiones especiales',
        precio: 40,
        duracion: 60,
        categoria: 'peinado'
      },
      {
        nombre: 'Tratamiento Capilar',
        descripcion: 'Tratamiento reparador para cabello dañado',
        precio: 45,
        duracion: 75,
        categoria: 'tratamiento'
      },
      {
        nombre: 'Manicura',
        descripcion: 'Cuidado completo de uñas',
        precio: 20,
        duracion: 45,
        categoria: 'manicura'
      }
    ];

    for (const servicio of servicios) {
      await new Service(servicio).save();
    }

    console.log('Base de datos poblada exitosamente');
    console.log('Usuarios creados:');
    console.log('- Admin: admin@peluqueria.com / admin123');
    console.log('- Peluquero 1: maria@peluqueria.com / maria123');
    console.log('- Peluquero 2: juan@peluqueria.com / juan123');
    console.log('- Cliente: cliente@ejemplo.com / cliente123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error poblando la base de datos:', error);
    process.exit(1);
  }
};

seedDatabase();
