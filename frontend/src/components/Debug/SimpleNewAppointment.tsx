import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  CircularProgress
} from '@mui/material';

interface Service {
  _id: string;
  nombre: string;
  precio: number;
  duracion: number;
}

interface Peluquero {
  _id: string;
  nombre: string;
}

const SimpleNewAppointment: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [peluqueros, setPeluqueros] = useState<Peluquero[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    servicio: '',
    peluquero: '',
    fecha: '',
    horaInicio: '',
    notas: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🔍 Cargando servicios y peluqueros...');
        
        const [servicesRes, peluquerosRes] = await Promise.all([
          axios.get('http://localhost:5000/api/services'),
          axios.get('http://localhost:5000/api/users/peluqueros')
        ]);
        
        console.log('✅ Servicios cargados:', servicesRes.data.length);
        console.log('✅ Peluqueros cargados:', peluquerosRes.data.length);
        
        setServices(servicesRes.data);
        setPeluqueros(peluquerosRes.data);
      } catch (err) {
        console.error('❌ Error cargando datos:', err);
        setError('Error al cargar datos iniciales');
      }
    };
    
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📝 Datos del formulario:', formData);
    
    if (!formData.servicio || !formData.peluquero || !formData.fecha || !formData.horaInicio) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      console.log('🔑 Token encontrado:', token ? 'Sí' : 'No');
      
      if (!token) {
        throw new Error('No hay token de autenticación. Por favor, inicia sesión.');
      }

      console.log('📅 Enviando solicitud de cita...');
      console.log('Datos a enviar:', formData);
      
      const response = await axios.post('http://localhost:5000/api/appointments', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('✅ Respuesta del servidor:', response.data);
      setMessage('¡Cita reservada exitosamente!');
      
      // Limpiar formulario
      setFormData({
        servicio: '',
        peluquero: '',
        fecha: '',
        horaInicio: '',
        notas: ''
      });
      
    } catch (err: any) {
      console.error('❌ Error al crear cita:', err);
      console.error('Detalles del error:', err.response?.data);
      
      const errorMessage = err.response?.data?.message || err.message || 'Error al reservar la cita';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Reservar Nueva Cita (Versión Simple)
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Servicio</InputLabel>
          <Select
            value={formData.servicio}
            label="Servicio"
            onChange={(e) => setFormData(prev => ({ ...prev, servicio: e.target.value }))}
          >
            {services.map((service) => (
              <MenuItem key={service._id} value={service._id}>
                {service.nombre} - ${service.precio} ({service.duracion} min)
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Peluquero</InputLabel>
          <Select
            value={formData.peluquero}
            label="Peluquero"
            onChange={(e) => setFormData(prev => ({ ...prev, peluquero: e.target.value }))}
          >
            {peluqueros.map((peluquero) => (
              <MenuItem key={peluquero._id} value={peluquero._id}>
                {peluquero.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          type="date"
          label="Fecha"
          value={formData.fecha}
          onChange={(e) => setFormData(prev => ({ ...prev, fecha: e.target.value }))}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          type="time"
          label="Hora"
          value={formData.horaInicio}
          onChange={(e) => setFormData(prev => ({ ...prev, horaInicio: e.target.value }))}
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Notas (opcional)"
          value={formData.notas}
          onChange={(e) => setFormData(prev => ({ ...prev, notas: e.target.value }))}
          sx={{ mb: 3 }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{ py: 1.5 }}
        >
          {loading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Reservando...
            </>
          ) : (
            'Reservar Cita'
          )}
        </Button>
      </form>

      <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
        Servicios disponibles: {services.length} | Peluqueros disponibles: {peluqueros.length}
      </Typography>
    </Box>
  );
};

export default SimpleNewAppointment;
