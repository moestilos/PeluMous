// Script para verificar y actualizar el password del cliente
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/peluqueria');

const UserSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  password: String,
  telefono: String,
  rol: { type: String, default: 'cliente' },
  fechaRegistro: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

async function updateClientPassword() {
  try {
    console.log('🔍 Buscando cliente...');
    
    const client = await User.findOne({ email: 'cliente@test.com' });
    if (!client) {
      console.log('❌ Cliente no encontrado');
      process.exit(1);
    }

    console.log('✅ Cliente encontrado:');
    console.log(`   Nombre: ${client.nombre}`);
    console.log(`   Email: ${client.email}`);

    // Verificar si el password actual funciona
    console.log('\n🔐 Verificando password actual...');
    const currentPasswordWorks = await bcrypt.compare('password123', client.password);
    
    if (currentPasswordWorks) {
      console.log('✅ El password "password123" ya funciona correctamente');
    } else {
      console.log('❌ El password no coincide, actualizando...');
      
      // Actualizar password
      const newHashedPassword = await bcrypt.hash('password123', 10);
      await User.updateOne(
        { email: 'cliente@test.com' },
        { password: newHashedPassword }
      );
      
      console.log('✅ Password actualizado a "password123"');
    }

    console.log('\n🎯 Credenciales para usar:');
    console.log('   Email: cliente@test.com');
    console.log('   Password: password123');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

updateClientPassword();
