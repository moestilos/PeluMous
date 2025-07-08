import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Chip,
  Stack,
  Avatar,
  useTheme,
  alpha
} from '@mui/material';
import {
  AccessTime,
  CalendarToday,
  Person,
  ContentCut,
  Schedule,
  CheckCircle,
  Event,
  Spa
} from '@mui/icons-material';
import { useNotification } from '../Notifications/NotificationProvider';
import axios from 'axios';

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
  email: string;
  especialidades: string[];
}

const NewAppointment: React.FC = () => {
  const { showSuccess, showError } = useNotification();
  const theme = useTheme();
  const [services, setServices] = useState<Service[]>([]);
  const [peluqueros, setPeluqueros] = useState<Peluquero[]>([]);
  // Generar horarios de media hora (9:00 - 18:00)
  const generateTimeSlots = () => {
    const slots: string[] = [];
    for (let hour = 9; hour < 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const initialTimeSlots = generateTimeSlots();
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>(initialTimeSlots);
  const [formData, setFormData] = useState({
    servicio: '',
    peluquero: '',
    fecha: '',
    horaInicio: '',
    notas: ''
  });
  const [loading, setLoading] = useState(false);

  const fetchServices = React.useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/services');
      setServices(response.data);
    } catch (error) {
      showError('Error al cargar servicios');
    }
  }, [showError]);

  const fetchPeluqueros = React.useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/peluqueros');
      setPeluqueros(response.data);
    } catch (error) {
      showError('Error al cargar peluqueros');
    }
  }, [showError]);

  // Verificar disponibilidad usando nuevo endpoint
  const checkAvailability = React.useCallback(async (peluqueroId: string, fecha: string) => {
    if (!peluqueroId || !fecha) {
      setAvailableTimeSlots(initialTimeSlots);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/appointments/availability', {
        headers: { Authorization: `Bearer ${token}` },
        params: { peluqueroId: peluqueroId, fecha: fecha }
      });
      const available = response.data.availableSlots as string[];
      setAvailableTimeSlots(available);
    } catch (error) {
      console.error('❌ Error verificando disponibilidad:', error);
      setAvailableTimeSlots(initialTimeSlots);
    }
  }, [initialTimeSlots]);

  useEffect(() => {
    fetchServices();
    fetchPeluqueros();
  }, [fetchServices, fetchPeluqueros]);

  // Actualizar slots cuando cambie peluquero o fecha
  useEffect(() => {
    checkAvailability(formData.peluquero, formData.fecha);
  }, [formData.peluquero, formData.fecha, checkAvailability]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.servicio || !formData.peluquero || !formData.fecha || !formData.horaInicio) {
      showError('Por favor completa todos los campos obligatorios');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      console.log('🚀 Enviando solicitud de cita...', formData);
      
      // Mapear los nombres de campos correctos para el backend
      const appointmentData = {
        peluquero: formData.peluquero,
        servicio: formData.servicio,
        fecha: formData.fecha,
        horaInicio: formData.horaInicio,
        notas: formData.notas
      };
      
      console.log('📤 Datos a enviar:', appointmentData);
      
      const response = await axios.post('http://localhost:5000/api/appointments', appointmentData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Cita creada exitosamente:', response.data);
      
      // Mostrar mensaje de éxito más detallado
      const appointment = response.data.appointment;
      showSuccess(`¡Cita reservada exitosamente! ${appointment.servicio.nombre} con ${appointment.peluquero.nombre} el ${new Date(appointment.fecha).toLocaleDateString()} a las ${appointment.horaInicio}`);
      
      // Limpiar formulario
      setFormData({
        servicio: '',
        peluquero: '',
        fecha: '',
        horaInicio: '',
        notas: ''
      });
      
      // Opcional: Redirigir a "Mis Citas" después de 3 segundos
      setTimeout(() => {
        window.location.href = '/dashboard?section=myAppointments';
      }, 3000);
      
    } catch (error: any) {
      console.error('❌ Error al crear cita:', error);
      console.error('❌ Detalles del error:', error.response?.data);
      const errorMessage = error.response?.data?.message || 'Error al reservar la cita';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const selectedService = services.find(s => s._id === formData.servicio);
  const selectedPeluquero = peluqueros.find(p => p._id === formData.peluquero);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box sx={{ 
        p: 4,
        maxWidth: 800,
        mx: 'auto',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
        borderRadius: 3,
        minHeight: '70vh'
      }}>
        {/* Header */}
        <motion.div variants={itemVariants}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
            <Avatar sx={{ 
              width: 60, 
              height: 60,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            }}>
              <Event sx={{ fontSize: 30 }} />
            </Avatar>
            <Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 0.5
                }}
              >
                Reservar Nueva Cita
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Programa tu próxima visita con nosotros
              </Typography>
            </Box>
          </Stack>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Selección de Servicio */}
            <motion.div variants={itemVariants}>
              <Card sx={{ 
                background: '#ffffff',
                border: '2px solid #000000',
                borderRadius: 2,
                boxShadow: '4px 4px 0px #000000',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translate(-2px, -2px)',
                  boxShadow: '6px 6px 0px #000000'
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                    <Avatar sx={{ 
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      width: 48,
                      height: 48
                    }}>
                      <ContentCut />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Selecciona el servicio
                    </Typography>
                  </Stack>
                  
                  <FormControl fullWidth>
                    <InputLabel>Servicio *</InputLabel>
                    <Select
                      value={formData.servicio}
                      label="Servicio *"
                      onChange={(e) => setFormData(prev => ({ ...prev, servicio: e.target.value }))}
                    >
                      {services.map((service) => (
                        <MenuItem key={service._id} value={service._id}>
                          <Box sx={{ width: '100%' }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                  {service.nombre}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {service.descripcion}
                                </Typography>
                              </Box>
                              <Stack alignItems="flex-end" spacing={0.5}>
                                <Chip 
                                  label={`$${service.precio}`} 
                                  color="primary" 
                                  size="small" 
                                  sx={{ fontWeight: 600 }}
                                />
                                <Typography variant="caption" color="text.secondary">
                                  {service.duracion} min
                                </Typography>
                              </Stack>
                            </Stack>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {selectedService && (
                    <Box sx={{ 
                      mt: 3, 
                      p: 3, 
                      background: alpha(theme.palette.primary.main, 0.05),
                      borderRadius: 2,
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                    }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        🎯 Servicio seleccionado: {selectedService.nombre}
                      </Typography>
                      <Stack direction="row" spacing={2}>
                        <Chip 
                          icon={<AccessTime />} 
                          label={`${selectedService.duracion} minutos`} 
                          variant="outlined" 
                          size="small"
                        />
                        <Chip 
                          label={`$${selectedService.precio}`} 
                          color="primary" 
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </Stack>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Selección de Peluquero */}
            <motion.div variants={itemVariants}>
              <Card sx={{ 
                background: '#ffffff',
                border: '2px solid #000000',
                borderRadius: 2,
                boxShadow: '4px 4px 0px #000000',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translate(-2px, -2px)',
                  boxShadow: '6px 6px 0px #000000'
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                    <Avatar sx={{ 
                      background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                      width: 48,
                      height: 48
                    }}>
                      <Person />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Selecciona el profesional
                    </Typography>
                  </Stack>
                  
                  <FormControl fullWidth>
                    <InputLabel>Peluquero *</InputLabel>
                    <Select
                      value={formData.peluquero}
                      label="Peluquero *"
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, peluquero: e.target.value, horaInicio: '' }));
                      }}
                    >
                      {peluqueros.map((peluquero) => (
                        <MenuItem key={peluquero._id} value={peluquero._id}>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Avatar sx={{ 
                              width: 32, 
                              height: 32,
                              background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`
                            }}>
                              {peluquero.nombre.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                {peluquero.nombre}
                              </Typography>
                              {peluquero.especialidades && peluquero.especialidades.length > 0 && (
                                <Typography variant="caption" color="text.secondary">
                                  {peluquero.especialidades.join(', ')}
                                </Typography>
                              )}
                            </Box>
                          </Stack>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {selectedPeluquero && (
                    <Box sx={{ 
                      mt: 3, 
                      p: 3, 
                      background: alpha(theme.palette.secondary.main, 0.05),
                      borderRadius: 2,
                      border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`
                    }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        👨‍💼 Profesional seleccionado: {selectedPeluquero.nombre}
                      </Typography>
                      {selectedPeluquero.especialidades && selectedPeluquero.especialidades.length > 0 && (
                        <Stack direction="row" spacing={1}>
                          {selectedPeluquero.especialidades.map((esp, index) => (
                            <Chip 
                              key={index}
                              icon={<Spa />}
                              label={esp} 
                              variant="outlined" 
                              size="small"
                            />
                          ))}
                        </Stack>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Fecha y Hora */}
            <motion.div variants={itemVariants}>
              <Card sx={{ 
                background: '#ffffff',
                border: '2px solid #000000',
                borderRadius: 2,
                boxShadow: '4px 4px 0px #000000',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translate(-2px, -2px)',
                  boxShadow: '6px 6px 0px #000000'
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                    <Avatar sx={{ 
                      background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
                      width: 48,
                      height: 48
                    }}>
                      <CalendarToday />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Fecha y hora de la cita
                    </Typography>
                  </Stack>
                  
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Fecha *"
                      value={formData.fecha}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, fecha: e.target.value, horaInicio: '' }));
                      }}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{
                        min: new Date().toISOString().split('T')[0]
                      }}
                    />
                    
                    <FormControl fullWidth>
                      <InputLabel>Hora *</InputLabel>
                      <Select
                        value={formData.horaInicio}
                        label="Hora *"
                        onChange={(e) => setFormData(prev => ({ ...prev, horaInicio: e.target.value }))}
                        disabled={!formData.peluquero || !formData.fecha}
                      >
                        {!availableTimeSlots.length ? (
                          <MenuItem disabled value="">
                            <em>No hay horarios disponibles</em>
                          </MenuItem>
                        ) : (
                          availableTimeSlots.map((slot) => (
                            <MenuItem key={slot} value={slot}>{slot}</MenuItem>
                          ))
                        )}
                      </Select>
                    </FormControl>
                  </Stack>

                  {/* Información sobre horarios */}
                  <Box sx={{ 
                    mt: 3, 
                    p: 2, 
                    background: alpha(theme.palette.info.main, 0.05),
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
                  }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'info.main' }}>
                      ℹ️ Información sobre horarios
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      • Horario de atención: 9:00 AM - 6:00 PM
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      • Citas disponibles en punto y media hora (ej: 10:00, 10:30)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Selecciona fecha y peluquero para ver horarios disponibles
                    </Typography>
                    {availableTimeSlots.length > 0 && formData.peluquero && formData.fecha && (
                      <Typography variant="body2" sx={{ mt: 1, color: 'success.main', fontWeight: 500 }}>
                        ✅ {availableTimeSlots.length} horarios disponibles para la fecha seleccionada
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>

            {/* Notas Adicionales */}
            <motion.div variants={itemVariants}>
              <Card sx={{ 
                background: '#ffffff',
                border: '2px solid #000000',
                borderRadius: 2,
                boxShadow: '4px 4px 0px #000000',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translate(-2px, -2px)',
                  boxShadow: '6px 6px 0px #000000'
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    📝 Notas adicionales (opcional)
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Comentarios o solicitudes especiales"
                    value={formData.notas}
                    onChange={(e) => setFormData(prev => ({ ...prev, notas: e.target.value }))}
                    placeholder="Ej: Tengo el cabello rizado, prefiero corte con tijeras, etc."
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Botón de Envío */}
            <motion.div variants={itemVariants}>
              <Card sx={{ 
                background: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
                border: 'none',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ 
                      background: '#ffffff',
                      border: '2px solid #000000',
                      color: '#000000',
                      width: 48,
                      height: 48
                    }}>
                      <CheckCircle sx={{ color: '#000000' }} />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ color: '#000000 !important', fontWeight: 600, mb: 0.5 }}>
                        Confirmar Reserva
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666666 !important' }}>
                        Revisa los datos y confirma tu cita
                      </Typography>
                    </Box>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading || !formData.servicio || !formData.peluquero || !formData.fecha || !formData.horaInicio}
                      startIcon={<Schedule />}
                      sx={{
                        background: 'white',
                        color: theme.palette.success.main,
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        border: '2px solid #000000',
                        '&:hover': {
                          background: '#f5f5f5',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                        },
                        '&:disabled': {
                          background: '#e0e0e0',
                          color: '#666666'
                        }
                      }}
                    >
                      {loading ? 'Reservando...' : 'Reservar Cita'}
                    </Button>
                  </Stack>
                </CardContent>
                {/* Elemento decorativo */}
                {/* Elemento decorativo eliminado para mayor claridad */}
              </Card>
            </motion.div>
          </Stack>
        </form>
      </Box>
    </motion.div>
  );
};

export default NewAppointment;
