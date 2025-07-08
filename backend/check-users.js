const mongoose = require('mongoose');
const User = require('./src/models/User');

async function checkUsers() {
  try {
    await mongoose.connect('mongodb://localhost:27017/peluqueria');
    console.log('📄 Usuarios encontrados en la base de datos:');
    
    const users = await User.find({});
    if (users.length === 0) {
      console.log('❌ No hay usuarios en la base de datos');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. Email: ${user.email}`);
        console.log(`   Tipo: ${user.tipo}`);
        console.log(`   Nombre: ${user.nombre}`);
        console.log(`   ID: ${user._id}`);
        console.log('   ---');
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkUsers();
