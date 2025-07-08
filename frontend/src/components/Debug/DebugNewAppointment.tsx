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
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';

interface Service {
  _id: string;
  nombre: string;
  precio: number;
  duracion: number;
  descripcion: string;
}

interface Peluquero {
  _id: string;
  nombre: string;
}

const DebugNewAppointment: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [peluqueros, setPeluqueros] = useState<Peluquero[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    servicio: '',
    peluquero: '',
    fecha: '',
    horaInicio: '',
    notas: ''
  });

  const addLog = (log: string) => {
    console.log(log);
    setDebugLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${log}`]);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        addLog('🔄 Iniciando carga de datos...');
        
        addLog('📋 Cargando servicios...');
        const servicesRes = await axios.get('http://localhost:5000/api/services');
        addLog(`✅ Servicios cargados: ${servicesRes.data.length}`);
        setServices(servicesRes.data);
        
        addLog('👨‍💼 Cargando peluqueros...');
        const peluquerosRes = await axios.get('http://localhost:5000/api/users/peluqueros');
        addLog(`✅ Peluqueros cargados: ${peluquerosRes.data.length}`);
        setPeluqueros(peluquerosRes.data);
        
        addLog('✅ Carga de datos completada');
        
      } catch (err: any) {
        addLog(`❌ Error cargando datos: ${err.message}`);
        setError('Error al cargar datos iniciales');
      }
    };
    
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    addLog('📝 Iniciando proceso de reserva...');
    addLog(`📊 Datos del formulario: ${JSON.stringify(formData, null, 2)}`);
    
    // Validación
    if (!formData.servicio || !formData.peluquero || !formData.fecha || !formData.horaInicio) {
      const errorMsg = 'Por favor completa todos los campos obligatorios';
      addLog(`❌ Validación fallida: ${errorMsg}`);
      setError(errorMsg);
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Verificar token
      const token = localStorage.getItem('token');
      addLog(`🔑 Token verificado: ${token ? 'ENCONTRADO' : 'NO ENCONTRADO'}`);
      
      if (!token) {
        throw new Error('No hay token de autenticación. Por favor, inicia sesión.');
      }

      addLog(`🔑 Token (primeros 20 chars): ${token.substring(0, 20)}...`);
      
      // Preparar headers
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      addLog(`📡 Headers preparados: ${JSON.stringify(headers, null, 2)}`);
      addLog(`🌐 URL destino: POST http://localhost:5000/api/appointments`);
      addLog(`📦 Payload: ${JSON.stringify(formData, null, 2)}`);
      
      addLog('🚀 Enviando solicitud...');
      
      const response = await axios.post('http://localhost:5000/api/appointments', formData, {
        headers
      });

      addLog(`✅ Respuesta recibida: Status ${response.status}`);
      addLog(`✅ Datos de respuesta: ${JSON.stringify(response.data, null, 2)}`);
      
      setMessage('¡Cita reservada exitosamente!');
      addLog('🎉 Cita creada exitosamente');
      
      // Limpiar formulario
      setFormData({
        servicio: '',
        peluquero: '',
        fecha: '',
        horaInicio: '',
        notas: ''
      });
      
      addLog('🧹 Formulario limpiado');
      
    } catch (err: any) {
      addLog(`❌ Error capturado: ${err.message}`);
      
      if (err.response) {
        addLog(`❌ Error de respuesta HTTP: ${err.response.status}`);
        addLog(`❌ Datos del error: ${JSON.stringify(err.response.data, null, 2)}`);
        addLog(`❌ Headers de error: ${JSON.stringify(err.response.headers, null, 2)}`);
      } else if (err.request) {
        addLog(`❌ Error de request: No se recibió respuesta`);
        addLog(`❌ Request config: ${JSON.stringify(err.config, null, 2)}`);
      } else {
        addLog(`❌ Error general: ${err.message}`);
      }
      
      const errorMessage = err.response?.data?.message || err.message || 'Error al reservar la cita';
      setError(errorMessage);
      addLog(`❌ Error final mostrado al usuario: ${errorMessage}`);
    } finally {
      setLoading(false);
      addLog('🔄 Proceso finalizado');
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        🔧 Debug - Reservar Nueva Cita
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
        {/* Formulario */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Formulario de Reserva
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
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, servicio: e.target.value }));
                    addLog(`🎯 Servicio seleccionado: ${e.target.value}`);
                  }}
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
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, peluquero: e.target.value }));
                    addLog(`👨‍💼 Peluquero seleccionado: ${e.target.value}`);
                  }}
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
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, fecha: e.target.value }));
                  addLog(`📅 Fecha seleccionada: ${e.target.value}`);
                }}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                type="time"
                label="Hora"
                value={formData.horaInicio}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, horaInicio: e.target.value }));
                  addLog(`⏰ Hora seleccionada: ${e.target.value}`);
                }}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notas (opcional)"
                value={formData.notas}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, notas: e.target.value }));
                }}
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
              Servicios: {services.length} | Peluqueros: {peluqueros.length}
            </Typography>
          </CardContent>
        </Card>

        {/* Debug Logs */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              🐛 Debug Logs
            </Typography>
            <Box sx={{ 
              height: 400, 
              overflow: 'auto', 
              backgroundColor: '#f5f5f5', 
              p: 2, 
              borderRadius: 1,
              fontFamily: 'monospace',
              fontSize: '0.8rem'
            }}>
              {debugLogs.map((log, index) => (
                <div key={index} style={{ marginBottom: '4px' }}>
                  {log}
                </div>
              ))}
              {debugLogs.length === 0 && (
                <div style={{ color: '#666' }}>
                  Los logs aparecerán aquí...
                </div>
              )}
            </Box>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={() => setDebugLogs([])}
              sx={{ mt: 1 }}
            >
              Limpiar Logs
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default DebugNewAppointment;
