import React, { useState, useEffect } from 'react';
import { Button, Box, Typography, Card, CardContent, Stack } from '@mui/material';
import axios from 'axios';

const DebugMyAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
    console.log('🪙 Token en localStorage:', storedToken ? 'Presente' : 'Ausente');
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      console.log('🔍 Intentando cargar citas...');
      console.log('🪙 Token:', token ? token.substring(0, 50) + '...' : 'NO HAY TOKEN');

      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await axios.get('http://localhost:5000/api/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Respuesta del servidor:', response);
      console.log('📊 Citas obtenidas:', response.data);
      
      setAppointments(response.data);
      
    } catch (error: any) {
      console.error('❌ Error completo:', error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    try {
      console.log('🔐 Probando login...');
      
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'cliente@test.com',
        password: 'password123'
      });

      console.log('✅ Login exitoso:', response.data);
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
      
    } catch (error: any) {
      console.error('❌ Error en login:', error);
      setError('Error en login: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        🔧 Debug MyAppointments
      </Typography>

      <Stack spacing={2} sx={{ mb: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6">Estado del Token</Typography>
            <Typography color={token ? 'success.main' : 'error.main'}>
              {token ? '✅ Token presente' : '❌ No hay token'}
            </Typography>
            {token && (
              <Typography variant="body2" sx={{ fontFamily: 'monospace', mt: 1 }}>
                {token.substring(0, 100)}...
              </Typography>
            )}
          </CardContent>
        </Card>

        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={testLogin}>
            🔐 Hacer Login de Prueba
          </Button>
          <Button 
            variant="outlined" 
            onClick={fetchAppointments}
            disabled={!token || loading}
          >
            {loading ? '⏳ Cargando...' : '📅 Cargar Citas'}
          </Button>
        </Stack>
      </Stack>

      {error && (
        <Card sx={{ mb: 2, borderColor: 'error.main' }}>
          <CardContent>
            <Typography color="error">❌ Error: {error}</Typography>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            📊 Citas Encontradas: {appointments.length}
          </Typography>
          
          {appointments.length === 0 ? (
            <Typography color="text.secondary">
              No hay citas para mostrar
            </Typography>
          ) : (
            <Stack spacing={1}>
              {appointments.map((apt, index) => (
                <Card key={apt._id} variant="outlined">
                  <CardContent sx={{ py: 1 }}>
                    <Typography variant="subtitle1">
                      {index + 1}. {apt.servicio?.nombre || 'Sin servicio'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      📅 {apt.fecha} ⏰ {apt.horaInicio} 👨‍💼 {apt.peluquero?.nombre} 
                      💰 ${apt.precio} 📊 {apt.estado}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default DebugMyAppointments;
