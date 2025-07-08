// Componente de prueba para debug del sistema de reservas
import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, Typography, Alert } from '@mui/material';

const ReservationDebugger: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const testReservation = async () => {
    console.log('🔍 Iniciando debug de reserva...');
    setLoading(true);
    setMessage('');
    setError('');

    try {
      // 1. Verificar token
      const token = localStorage.getItem('token');
      console.log('Token:', token ? 'Presente' : 'Ausente');
      
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      // 2. Verificar servicios
      console.log('📋 Obteniendo servicios...');
      const servicesResponse = await axios.get('http://localhost:5000/api/services');
      console.log('Servicios obtenidos:', servicesResponse.data.length);

      // 3. Verificar peluqueros
      console.log('👨‍💼 Obteniendo peluqueros...');
      const peluquerosResponse = await axios.get('http://localhost:5000/api/users/peluqueros');
      console.log('Peluqueros obtenidos:', peluquerosResponse.data.length);

      // 4. Crear cita de prueba
      console.log('📅 Creando cita de prueba...');
      const appointmentData = {
        servicio: servicesResponse.data[0]._id,
        peluquero: peluquerosResponse.data[0]._id,
        fecha: '2025-07-15',
        horaInicio: '15:00',
        notas: 'Prueba desde frontend'
      };

      console.log('Datos de la cita:', appointmentData);

      const response = await axios.post('http://localhost:5000/api/appointments', appointmentData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('✅ Cita creada exitosamente:', response.data);
      setMessage('¡Cita creada exitosamente desde el frontend!');

    } catch (err: any) {
      console.error('❌ Error al crear cita:', err);
      console.error('Detalles del error:', err.response?.data || err.message);
      setError(err.response?.data?.message || err.message || 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No hay token de autenticación');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Usuario autenticado:', response.data.user);
      setMessage(`Usuario autenticado: ${response.data.user.nombre} (${response.data.user.rol})`);
    } catch (err: any) {
      console.error('Error de autenticación:', err);
      setError('Error de autenticación: ' + (err.response?.data?.message || err.message));
    }
  };

  const loginTestUser = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'cliente@test.com',
        password: '123456'
      });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      setMessage('Login exitoso. Token guardado.');
      console.log('Login exitoso:', response.data);
    } catch (err: any) {
      console.error('Error en login:', err);
      setError('Error en login: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        🔧 Debug del Sistema de Reservas
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Button 
          variant="contained" 
          onClick={loginTestUser}
          sx={{ mr: 2 }}
        >
          Login Cliente Test
        </Button>
        
        <Button 
          variant="outlined" 
          onClick={checkAuth}
          sx={{ mr: 2 }}
        >
          Verificar Auth
        </Button>
        
        <Button 
          variant="contained" 
          color="success"
          onClick={testReservation}
          disabled={loading}
        >
          {loading ? 'Creando...' : 'Probar Reserva'}
        </Button>
      </Box>

      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Typography variant="body2" color="text.secondary">
        Abre la consola del navegador para ver los logs detallados.
      </Typography>
    </Box>
  );
};

export default ReservationDebugger;
