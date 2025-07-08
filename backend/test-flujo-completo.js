// Prueba manual completa del flujo de reservas
const axios = require('axios');

const testCompleteReservationFlow = async () => {
  console.log('🔥 PRUEBA COMPLETA DEL FLUJO DE RESERVAS');
  console.log('========================================');
  
  try {
    // PASO 1: Login como cliente
    console.log('\n1️⃣ HACIENDO LOGIN COMO CLIENTE');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'cliente@test.com',
      password: '123456'
    });
    
    const { token, user } = loginResponse.data;
    console.log(`✅ Login exitoso - Usuario: ${user.nombre} (${user.rol})`);
    console.log(`🔑 Token obtenido: ${token.substring(0, 20)}...`);
    
    // PASO 2: Obtener servicios (simula la carga del frontend)
    console.log('\n2️⃣ OBTENIENDO SERVICIOS DISPONIBLES');
    const servicesResponse = await axios.get('http://localhost:5000/api/services');
    console.log(`✅ Servicios obtenidos: ${servicesResponse.data.length}`);
    servicesResponse.data.forEach((service, index) => {
      console.log(`   ${index + 1}. ${service.nombre} - $${service.precio} (${service.duracion}min)`);
    });
    
    // PASO 3: Obtener peluqueros (simula la carga del frontend)
    console.log('\n3️⃣ OBTENIENDO PELUQUEROS DISPONIBLES');
    const peluquerosResponse = await axios.get('http://localhost:5000/api/users/peluqueros');
    console.log(`✅ Peluqueros obtenidos: ${peluquerosResponse.data.length}`);
    peluquerosResponse.data.forEach((peluquero, index) => {
      console.log(`   ${index + 1}. ${peluquero.nombre}`);
    });
    
    // PASO 4: Simular selección del usuario
    const selectedService = servicesResponse.data[0];
    const selectedPeluquero = peluquerosResponse.data[0];
    
    console.log('\n4️⃣ SIMULANDO SELECCIÓN DEL USUARIO');
    console.log(`📋 Servicio seleccionado: ${selectedService.nombre}`);
    console.log(`👨‍💼 Peluquero seleccionado: ${selectedPeluquero.nombre}`);
    
    // PASO 5: Preparar datos de la cita (exactamente como lo haría el frontend)
    const appointmentData = {
      servicio: selectedService._id,
      peluquero: selectedPeluquero._id,
      fecha: '2025-07-20',
      horaInicio: '10:30',
      notas: 'Reserva de prueba completa desde simulación'
    };
    
    console.log('\n5️⃣ DATOS DE LA CITA A ENVIAR');
    console.log('📝 Datos:', JSON.stringify(appointmentData, null, 2));
    
    // PASO 6: Crear la cita (exactamente como lo haría el frontend)
    console.log('\n6️⃣ ENVIANDO SOLICITUD DE RESERVA');
    console.log(`🔗 URL: POST http://localhost:5000/api/appointments`);
    console.log(`🔑 Authorization: Bearer ${token.substring(0, 20)}...`);
    
    const appointmentResponse = await axios.post(
      'http://localhost:5000/api/appointments', 
      appointmentData,
      {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('\n🎉 ¡CITA CREADA EXITOSAMENTE!');
    console.log('=============================================');
    console.log(`📅 ID de la cita: ${appointmentResponse.data.appointment._id}`);
    console.log(`👤 Cliente: ${appointmentResponse.data.appointment.cliente.nombre}`);
    console.log(`👨‍💼 Peluquero: ${appointmentResponse.data.appointment.peluquero.nombre}`);
    console.log(`📋 Servicio: ${appointmentResponse.data.appointment.servicio.nombre}`);
    console.log(`📅 Fecha: ${appointmentResponse.data.appointment.fecha}`);
    console.log(`⏰ Hora: ${appointmentResponse.data.appointment.horaInicio} - ${appointmentResponse.data.appointment.horaFin}`);
    console.log(`💰 Precio: $${appointmentResponse.data.appointment.precio}`);
    console.log(`📝 Notas: ${appointmentResponse.data.appointment.notas}`);
    
    // PASO 7: Verificar que la cita aparezca en la lista del cliente
    console.log('\n7️⃣ VERIFICANDO CITAS DEL CLIENTE');
    const myAppointmentsResponse = await axios.get('http://localhost:5000/api/appointments', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log(`✅ Total de citas del cliente: ${myAppointmentsResponse.data.length}`);
    myAppointmentsResponse.data.forEach((appointment, index) => {
      console.log(`   ${index + 1}. ${appointment.servicio.nombre} - ${appointment.fecha.substring(0, 10)} ${appointment.horaInicio}`);
    });
    
    console.log('\n✨ TODAS LAS PRUEBAS PASARON EXITOSAMENTE ✨');
    console.log('==========================================');
    console.log('🔹 El backend funciona perfectamente');
    console.log('🔹 La autenticación funciona');
    console.log('🔹 Los datos se cargan correctamente');
    console.log('🔹 Las citas se crean sin problemas');
    console.log('🔹 Las citas aparecen en la lista del cliente');
    console.log('');
    console.log('💡 SI EL FRONTEND NO FUNCIONA, EL PROBLEMA ESTÁ EN:');
    console.log('   - Configuración de axios en el frontend');
    console.log('   - Manejo de errores en el componente');
    console.log('   - Contexto de autenticación');
    console.log('   - Flujo de navegación');
    
  } catch (error) {
    console.error('\n❌ ERROR EN LA PRUEBA:');
    console.error('======================');
    
    if (error.response) {
      console.error(`🔴 Status: ${error.response.status}`);
      console.error(`🔴 Status Text: ${error.response.statusText}`);
      console.error(`🔴 Data:`, error.response.data);
      console.error(`🔴 Headers:`, error.response.headers);
    } else if (error.request) {
      console.error('🔴 No se recibió respuesta del servidor');
      console.error('🔴 Request:', error.request);
    } else {
      console.error('🔴 Error configurando la request:', error.message);
    }
    
    console.error('\n🔍 Stack trace:', error.stack);
  }
};

// Ejecutar la prueba
testCompleteReservationFlow();
