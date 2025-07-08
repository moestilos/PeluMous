// Script para verificar datos de prueba directamente
const axios = require('axios');

async function checkData() {
  try {
    console.log('🔍 Verificando datos en el backend...\n');

    // 1. Verificar servicios
    console.log('📋 Verificando servicios...');
    try {
      const servicesResponse = await axios.get('http://localhost:5000/api/services');
      console.log(`✅ Servicios encontrados: ${servicesResponse.data.length}`);
      servicesResponse.data.forEach((service, index) => {
        console.log(`   ${index + 1}. ${service.nombre} - $${service.precio} (${service.duracion}min)`);
      });
    } catch (error) {
      console.log('❌ Error al obtener servicios:', error.message);
    }

    // 2. Verificar peluqueros
    console.log('\n👨‍💼 Verificando peluqueros...');
    try {
      const barbersResponse = await axios.get('http://localhost:5000/api/users/peluqueros');
      console.log(`✅ Peluqueros encontrados: ${barbersResponse.data.length}`);
      barbersResponse.data.forEach((barber, index) => {
        console.log(`   ${index + 1}. ${barber.nombre} (${barber.email})`);
      });
    } catch (error) {
      console.log('❌ Error al obtener peluqueros:', error.message);
    }

    // 3. Probar login de cliente
    console.log('\n🔐 Probando login de cliente...');
    try {
      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'cliente@test.com',
        password: 'password123'
      });
      
      const token = loginResponse.data.token;
      console.log('✅ Login exitoso, token obtenido');

      // 4. Verificar citas del cliente con el token
      console.log('\n📅 Verificando citas del cliente...');
      try {
        const appointmentsResponse = await axios.get('http://localhost:5000/api/appointments', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log(`✅ Citas del cliente: ${appointmentsResponse.data.length}`);
        if (appointmentsResponse.data.length > 0) {
          appointmentsResponse.data.forEach((apt, index) => {
            console.log(`   ${index + 1}. ${apt.servicio.nombre} - ${apt.fecha} ${apt.horaInicio} (${apt.estado})`);
          });
        } else {
          console.log('   📭 No hay citas para este cliente');
        }
      } catch (error) {
        console.log('❌ Error al obtener citas:', error.response?.data?.message || error.message);
      }

    } catch (error) {
      console.log('❌ Error en login:', error.response?.data?.message || error.message);
      
      // Probar con otros usuarios posibles
      console.log('\n🔄 Probando con otros usuarios...');
      const testUsers = [
        { email: 'admin@test.com', password: 'admin123' },
        { email: 'cliente@ejemplo.com', password: '123456' },
        { email: 'test@test.com', password: 'test123' }
      ];

      for (const testUser of testUsers) {
        try {
          const testLogin = await axios.post('http://localhost:5000/api/auth/login', testUser);
          console.log(`✅ Login exitoso con ${testUser.email}`);
          break;
        } catch (err) {
          console.log(`❌ Falló login con ${testUser.email}`);
        }
      }
    }

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

checkData();
