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

  useEffect(() => {
    fetchServices();
    fetchPeluqueros();
  }, [fetchServices, fetchPeluqueros]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.servicio || !formData.peluquero || !formData.fecha || !formData.horaInicio) {
      showError('Por favor completa todos los campos obligatorios');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/appointments', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showSuccess('Cita reservada exitosamente');
      setFormData({
        servicio: '',
        peluquero: '',
        fecha: '',
        horaInicio: '',
        notas: ''
      });
    } catch (error: any) {
      showError(error.response?.data?.message || 'Error al reservar la cita');
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
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
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
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: `0 8px 32px ${alpha(theme.palette.secondary.main, 0.1)}`,
                  border: `1px solid ${alpha(theme.palette.secondary.main, 0.3)}`
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
                      onChange={(e) => setFormData(prev => ({ ...prev, peluquero: e.target.value }))}
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
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: `0 8px 32px ${alpha(theme.palette.info.main, 0.1)}`,
                  border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`
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
                      onChange={(e) => setFormData(prev => ({ ...prev, fecha: e.target.value }))}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{
                        min: new Date().toISOString().split('T')[0]
                      }}
                    />
                    <TextField
                      fullWidth
                      type="time"
                      label="Hora *"
                      value={formData.horaInicio}
                      onChange={(e) => setFormData(prev => ({ ...prev, horaInicio: e.target.value }))}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{
                        min: "09:00",
                        max: "18:00",
                        step: "1800" // 30 minutos
                      }}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>

            {/* Notas Adicionales */}
            <motion.div variants={itemVariants}>
              <Card sx={{ 
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: `0 8px 32px ${alpha(theme.palette.warning.main, 0.1)}`,
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`
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
                      background: 'rgba(255,255,255,0.2)',
                      width: 48,
                      height: 48
                    }}>
                      <CheckCircle sx={{ color: 'white' }} />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 0.5 }}>
                        Confirmar Reserva
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
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
                        '&:hover': {
                          background: 'rgba(255,255,255,0.9)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                        },
                        '&:disabled': {
                          background: 'rgba(255,255,255,0.5)',
                          color: 'rgba(76, 175, 80, 0.5)'
                        }
                      }}
                    >
                      {loading ? 'Reservando...' : 'Reservar Cita'}
                    </Button>
                  </Stack>
                </CardContent>
                {/* Elemento decorativo */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -20,
                    right: -20,
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    filter: 'blur(20px)'
                  }}
                />
              </Card>
            </motion.div>
          </Stack>
        </form>
      </Box>
    </motion.div>
  );
};

export default NewAppointment;
