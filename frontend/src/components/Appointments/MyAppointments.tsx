import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  useTheme,
  alpha
} from '@mui/material';
import { useNotification } from '../Notifications/NotificationProvider';
import { 
  MoreVert as MoreVertIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  ContentCut as ServiceIcon,
  EventNote as NoteIcon,
  CalendarToday,
  AttachMoney,
  Cancel,
  CheckCircle,
  Schedule,
  History,
  Refresh
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

interface Appointment {
  _id: string;
  cliente: {
    _id: string;
    nombre: string;
    email: string;
    telefono: string;
  };
  peluquero: {
    _id: string;
    nombre: string;
  };
  servicio: {
    _id: string;
    nombre: string;
    precio: number;
    duracion: number;
  };
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  notas?: string;
  precio: number;
  createdAt: string;
}

const MyAppointments: React.FC = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const theme = useTheme();
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuAppointment, setMenuAppointment] = useState<Appointment | null>(null);

  const fetchAppointments = React.useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔍 Cargando citas del cliente...');
      
      const token = localStorage.getItem('token');
      if (!token) {
        showError('No estás autenticado. Por favor, inicia sesión nuevamente.');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Citas cargadas exitosamente:', response.data);
      
      // Asegurar que tenemos un array
      const appointmentsData = Array.isArray(response.data) ? response.data : [];
      setAppointments(appointmentsData);
      
      if (appointmentsData.length === 0) {
        console.log('📭 No se encontraron citas para este usuario');
      } else {
        console.log(`📊 Se cargaron ${appointmentsData.length} citas`);
        // Log detallado de cada cita para debug
        appointmentsData.forEach((apt, index) => {
          console.log(`${index + 1}. ${apt.servicio?.nombre} - ${apt.fecha} ${apt.horaInicio} (${apt.estado})`);
        });
      }
      
    } catch (error: any) {
      console.error('❌ Error al cargar citas:', error);
      
      if (error.response?.status === 401) {
        showError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        // Opcional: redirigir al login
        // window.location.href = '/login';
      } else if (error.response?.status === 404) {
        console.log('📭 No se encontraron citas (404 - es normal si no hay citas)');
        setAppointments([]);
      } else {
        showError(error.response?.data?.message || error.message || 'Error al cargar las citas');
      }
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [fetchAppointments, user]);

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      console.log('🚫 Cancelando cita:', appointmentId);
      
      const token = localStorage.getItem('token');
      if (!token) {
        showError('No estás autenticado. Por favor, inicia sesión nuevamente.');
        return;
      }

      await axios.delete(`http://localhost:5000/api/appointments/${appointmentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Cita cancelada exitosamente');
      showSuccess('Cita cancelada exitosamente');
      
      // Cerrar diálogos y limpiar estados
      setShowCancelDialog(false);
      setSelectedAppointment(null);
      setAnchorEl(null);
      setMenuAppointment(null);
      
      // Recargar la lista de citas después de un breve delay
      setTimeout(() => {
        fetchAppointments();
      }, 500);
      
    } catch (error: any) {
      console.error('❌ Error al cancelar cita:', error);
      
      if (error.response?.status === 401) {
        showError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      } else if (error.response?.status === 404) {
        showError('La cita ya no existe o ha sido cancelada previamente.');
        // Recargar la lista para reflejar el estado actual
        fetchAppointments();
      } else {
        showError(error.response?.data?.message || error.message || 'Error al cancelar la cita');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente': return 'warning';
      case 'confirmada': return 'info';
      case 'completada': return 'success';
      case 'cancelada': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pendiente': return 'Pendiente';
      case 'confirmada': return 'Confirmada';
      case 'completada': return 'Completada';
      case 'cancelada': return 'Cancelada';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, appointment: Appointment) => {
    setAnchorEl(event.currentTarget);
    setMenuAppointment(appointment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuAppointment(null);
  };

  const handleCancelClick = () => {
    if (menuAppointment) {
      setSelectedAppointment(menuAppointment);
      setShowCancelDialog(true);
    }
    handleMenuClose();
  };

  const canCancelAppointment = (appointment: Appointment) => {
    if (appointment.estado === 'cancelada' || appointment.estado === 'completada') {
      return false;
    }

    // Crear fecha correctamente
    const appointmentDate = new Date(appointment.fecha);
    const [hora, minutos] = appointment.horaInicio.split(':').map(Number);
    appointmentDate.setHours(hora, minutos, 0, 0);
    
    const now = new Date();
    const timeDiff = appointmentDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);

    return hoursDiff > 24; // Permitir cancelar solo si faltan más de 24 horas
  };

  // Separar citas próximas y pasadas
  const now = new Date();
  const upcomingAppointments = appointments.filter(apt => {
    // Crear fecha correctamente desde la fecha ISO y hora
    const appointmentDate = new Date(apt.fecha);
    const [hora, minutos] = apt.horaInicio.split(':').map(Number);
    appointmentDate.setHours(hora, minutos, 0, 0);
    
    console.log(`🔍 Comparando cita: ${apt.servicio.nombre} - ${appointmentDate.toISOString()} vs ${now.toISOString()}`);
    return appointmentDate > now;
  });

  const pastAppointments = appointments.filter(apt => {
    // Crear fecha correctamente desde la fecha ISO y hora
    const appointmentDate = new Date(apt.fecha);
    const [hora, minutos] = apt.horaInicio.split(':').map(Number);
    appointmentDate.setHours(hora, minutos, 0, 0);
    
    return appointmentDate <= now;
  });

  if (loading) {
    return (
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '300px'
      }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Cargando tus citas...
        </Typography>
      </Box>
    );
  }

  // Mostrar mensaje si no hay citas en absoluto
  if (!loading && appointments.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
          Mis Citas
        </Typography>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card sx={{ 
            textAlign: 'center',
            p: 4,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
          }}>
            <CalendarToday sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
              No tienes citas reservadas
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              ¡Es hora de reservar tu próxima cita! Nuestros profesionales están esperando para atenderte.
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => window.location.href = '/appointments/new'}
              sx={{ borderRadius: 28 }}
            >
              Reservar mi primera cita
            </Button>
          </Card>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Mis Citas
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchAppointments}
            disabled={loading}
            sx={{ borderRadius: 20 }}
          >
            {loading ? 'Actualizando...' : 'Actualizar'}
          </Button>
        </Stack>
      </motion.div>

      {/* Información adicional si hay citas */}
      {appointments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Alert severity="info" sx={{ mb: 3 }}>
            Tienes {upcomingAppointments.length} cita{upcomingAppointments.length !== 1 ? 's' : ''} próxima{upcomingAppointments.length !== 1 ? 's' : ''} 
            y {pastAppointments.length} en tu historial. Recuerda que puedes cancelar una cita hasta 24 horas antes.
          </Alert>
        </motion.div>
      )}

      {/* Próximas citas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <Schedule color="primary" />
            <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              Próximas Citas ({upcomingAppointments.length})
            </Typography>
          </Stack>
          
          {upcomingAppointments.length === 0 ? (
            <Card sx={{ 
              textAlign: 'center',
              p: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
            }}>
              <CalendarToday sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                No hay citas próximas
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                ¡Reserva una nueva cita cuando quieras!
              </Typography>
              <Button 
                variant="outlined" 
                onClick={() => window.location.href = '/appointments/new'}
                sx={{ borderRadius: 20 }}
              >
                Reservar nueva cita
              </Button>
            </Card>
          ) : (
            <Stack spacing={2}>
              {upcomingAppointments.map((appointment, index) => (
                <motion.div
                  key={appointment._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card sx={{ 
                    border: appointment.estado === 'pendiente' ? `2px solid ${theme.palette.warning.main}` : `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    '&:hover': { 
                      boxShadow: 6,
                      transform: 'translateY(-2px)',
                      transition: 'all 0.3s ease'
                    },
                    background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`
                  }}>
                    <CardContent>
                      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="flex-start">
                        <Box sx={{ flex: 1 }}>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                            <ServiceIcon color="primary" fontSize="small" />
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {appointment.servicio.nombre}
                            </Typography>
                            <Chip 
                              label={getStatusText(appointment.estado)}
                              color={getStatusColor(appointment.estado) as any}
                              size="small"
                              sx={{ fontWeight: 'bold' }}
                            />
                          </Stack>
                          
                          <Stack spacing={1}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <PersonIcon color="action" fontSize="small" />
                              <Typography variant="body2">
                                Con: <strong>{appointment.peluquero.nombre}</strong>
                              </Typography>
                            </Stack>
                            
                            <Stack direction="row" spacing={1} alignItems="center">
                              <TimeIcon color="action" fontSize="small" />
                              <Typography variant="body2">
                                <strong>{formatDate(appointment.fecha)}</strong> a las <strong>{formatTime(appointment.horaInicio)}</strong>
                              </Typography>
                            </Stack>
                            
                            <Stack direction="row" spacing={1} alignItems="center">
                              <AttachMoney color="action" fontSize="small" />
                              <Typography variant="body2">
                                Duración: <strong>{appointment.servicio.duracion} min</strong>
                              </Typography>
                            </Stack>
                            
                            {appointment.notas && (
                              <Stack direction="row" spacing={1} alignItems="flex-start">
                                <NoteIcon color="action" fontSize="small" />
                                <Typography variant="body2" color="text.secondary">
                                  <em>{appointment.notas}</em>
                                </Typography>
                              </Stack>
                            )}
                          </Stack>
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                            €{appointment.precio}
                          </Typography>
                          <IconButton 
                            onClick={(e) => handleMenuClick(e, appointment)}
                            size="small"
                            sx={{ 
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.2) }
                            }}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Stack>
          )}
        </Box>
      </motion.div>

      {/* Historial */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Box>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <History color="action" />
            <Typography variant="h5" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
              Historial ({pastAppointments.length})
            </Typography>
          </Stack>
          
          {pastAppointments.length === 0 ? (
            <Card sx={{ 
              textAlign: 'center',
              p: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.grey[500], 0.1)} 0%, ${alpha(theme.palette.grey[500], 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.grey[500], 0.2)}`
            }}>
              <History sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                Sin historial aún
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Aquí aparecerán tus citas pasadas una vez que las tengas.
              </Typography>
            </Card>
          ) : (
            <Stack spacing={2}>
              {pastAppointments.map((appointment, index) => (
                <motion.div
                  key={appointment._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card sx={{ 
                    opacity: 0.8,
                    '&:hover': { 
                      opacity: 1,
                      boxShadow: 3,
                      transition: 'all 0.3s ease'
                    },
                    background: `linear-gradient(135deg, ${alpha(theme.palette.grey[100], 0.5)} 0%, ${alpha(theme.palette.grey[50], 0.8)} 100%)`
                  }}>
                    <CardContent>
                      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="flex-start">
                        <Box sx={{ flex: 1 }}>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                            <ServiceIcon color="primary" fontSize="small" />
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              {appointment.servicio.nombre}
                            </Typography>
                            <Chip 
                              label={getStatusText(appointment.estado)}
                              color={getStatusColor(appointment.estado) as any}
                              size="small"
                              variant="outlined"
                            />
                          </Stack>
                          
                          <Stack spacing={1}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <PersonIcon color="action" fontSize="small" />
                              <Typography variant="body2">
                                Con: <strong>{appointment.peluquero.nombre}</strong>
                              </Typography>
                            </Stack>
                            
                            <Stack direction="row" spacing={1} alignItems="center">
                              <TimeIcon color="action" fontSize="small" />
                              <Typography variant="body2">
                                <strong>{formatDate(appointment.fecha)}</strong> a las <strong>{formatTime(appointment.horaInicio)}</strong>
                              </Typography>
                            </Stack>
                            
                            {appointment.notas && (
                              <Stack direction="row" spacing={1} alignItems="flex-start">
                                <NoteIcon color="action" fontSize="small" />
                                <Typography variant="body2" color="text.secondary">
                                  <em>{appointment.notas}</em>
                                </Typography>
                              </Stack>
                            )}
                          </Stack>
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                            €{appointment.precio}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Stack>
          )}
        </Box>
      </motion.div>

      {/* Menú contextual */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {menuAppointment && canCancelAppointment(menuAppointment) && (
          <MenuItem onClick={handleCancelClick} sx={{ color: 'error.main' }}>
            Cancelar Cita
          </MenuItem>
        )}
        {menuAppointment && !canCancelAppointment(menuAppointment) && (
          <MenuItem disabled>
            {menuAppointment.estado === 'cancelada' || menuAppointment.estado === 'completada' 
              ? 'No se puede cancelar' 
              : 'No se puede cancelar (menos de 24h)'}
          </MenuItem>
        )}
      </Menu>

      {/* Dialog de confirmación para cancelar */}
      <Dialog 
        open={showCancelDialog} 
        onClose={() => setShowCancelDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ 
          textAlign: 'center',
          pb: 1,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}>
          <Cancel color="error" sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
            Confirmar Cancelación
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedAppointment && (
            <Box>
              <Alert severity="warning" sx={{ mb: 3 }}>
                <Typography sx={{ mb: 1 }}>
                  ¿Estás seguro de que quieres cancelar esta cita?
                </Typography>
                <Typography variant="body2">
                  Esta acción no se puede deshacer.
                </Typography>
              </Alert>
              
              <Card sx={{ 
                background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.05)} 0%, ${alpha(theme.palette.error.main, 0.1)} 100%)`,
                border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`
              }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <ServiceIcon color="primary" />
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {selectedAppointment.servicio.nombre}
                      </Typography>
                    </Stack>
                    
                    <Divider />
                    
                    <Stack spacing={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CalendarToday color="action" fontSize="small" />
                        <Typography variant="body1">
                          <strong>Fecha:</strong> {formatDate(selectedAppointment.fecha)}
                        </Typography>
                      </Stack>
                      
                      <Stack direction="row" spacing={1} alignItems="center">
                        <TimeIcon color="action" fontSize="small" />
                        <Typography variant="body1">
                          <strong>Hora:</strong> {formatTime(selectedAppointment.horaInicio)} - {formatTime(selectedAppointment.horaFin)}
                        </Typography>
                      </Stack>
                      
                      <Stack direction="row" spacing={1} alignItems="center">
                        <PersonIcon color="action" fontSize="small" />
                        <Typography variant="body1">
                          <strong>Peluquero:</strong> {selectedAppointment.peluquero.nombre}
                        </Typography>
                      </Stack>
                      
                      <Stack direction="row" spacing={1} alignItems="center">
                        <AttachMoney color="action" fontSize="small" />
                        <Typography variant="body1">
                          <strong>Precio:</strong> €{selectedAppointment.precio}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={() => setShowCancelDialog(false)}
            variant="outlined"
            size="large"
            sx={{ mr: 1, borderRadius: 20 }}
          >
            No, mantener cita
          </Button>
          <Button 
            onClick={() => selectedAppointment && handleCancelAppointment(selectedAppointment._id)}
            variant="contained"
            color="error"
            size="large"
            sx={{ borderRadius: 20 }}
            startIcon={<Cancel />}
          >
            Sí, cancelar cita
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyAppointments;
