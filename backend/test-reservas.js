// Script de prueba para el flujo completo de reservas
const axios = require('axios');

const testReservationFlow = async () => {
  console.log('🧪 INICIANDO PRUEBA DEL FLUJO DE RESERVAS');
  console.log('=====================================');
  
  try {
    // 1. Verificar servicios disponibles
    console.log('1️⃣ Verificando servicios...');
    const servicesResponse = await axios.get('http://localhost:5000/api/services');
    console.log(`✅ Servicios disponibles: ${servicesResponse.data.length}`);
    console.log('Servicios:', servicesResponse.data.map(s => ({ id: s._id, nombre: s.nombre })));
    
    // 2. Verificar peluqueros disponibles
    console.log('\n2️⃣ Verificando peluqueros...');
    const peluquerosResponse = await axios.get('http://localhost:5000/api/users/peluqueros');
    console.log(`✅ Peluqueros disponibles: ${peluquerosResponse.data.length}`);
    console.log('Peluqueros:', peluquerosResponse.data.map(p => ({ id: p._id, nombre: p.nombre })));
    
    // 3. Login del cliente
    console.log('\n3️⃣ Haciendo login del cliente...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'cliente@test.com',
      password: '123456'
    });
    console.log('✅ Login exitoso');
    const token = loginResponse.data.token;
    
    // 4. Intentar crear una cita
    console.log('\n4️⃣ Creando cita de prueba...');
    const appointmentData = {
      servicio: servicesResponse.data[0]._id,
      peluquero: peluquerosResponse.data[0]._id,
      fecha: '2025-07-15',
      horaInicio: '14:00',
      notas: 'Cita de prueba automática'
    };
    
    console.log('Datos de la cita:', appointmentData);
    
    const appointmentResponse = await axios.post('http://localhost:5000/api/appointments', appointmentData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ ¡CITA CREADA EXITOSAMENTE!');
    console.log('Detalles de la cita:', appointmentResponse.data);
    
    // 5. Verificar las citas del cliente
    console.log('\n5️⃣ Verificando citas del cliente...');
    const myAppointmentsResponse = await axios.get('http://localhost:5000/api/appointments', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`✅ Citas del cliente: ${myAppointmentsResponse.data.length}`);
    
    console.log('\n🎉 TODAS LAS PRUEBAS PASARON EXITOSAMENTE');
    console.log('=======================================');
    console.log('✅ El backend funciona correctamente');
    console.log('✅ Los datos están disponibles');
    console.log('✅ La autenticación funciona');
    console.log('✅ Las citas se pueden crear');
    console.log('\n💡 El problema debe estar en el frontend');
    
  } catch (error) {
    console.error('\n❌ ERROR EN LA PRUEBA:');
    console.error('Detalle del error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('🔒 Problema de autenticación');
    } else if (error.response?.status === 400) {
      console.log('📝 Datos inválidos en la solicitud');
    } else if (error.response?.status === 404) {
      console.log('🔍 Recurso no encontrado');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('🔌 El servidor backend no está corriendo');
    }
  }
};

// Ejecutar la prueba
testReservationFlow();
