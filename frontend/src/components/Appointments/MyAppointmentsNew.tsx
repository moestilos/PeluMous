import React, { useState, useEffect } from 'react';
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
  Divider,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import { useNotification } from '../Notifications/NotificationProvider';
import { 
  MoreVert as MoreVertIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  ContentCut as ServiceIcon,
  EventNote as NoteIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

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
  useAuth(); // Para autenticación
  const { showSuccess, showError } = useNotification();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuAppointment, setMenuAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/appointments', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar las citas');
      }

      const data = await response.json();
      setAppointments(data);
    } catch (error: any) {
      showError(error.message || 'Error al cargar las citas');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/appointments/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cancelar la cita');
      }

      showSuccess('Cita cancelada exitosamente');
      fetchAppointments();
      setShowCancelDialog(false);
      setSelectedAppointment(null);
    } catch (error: any) {
      showError(error.message || 'Error al cancelar la cita');
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

    const appointmentDate = new Date(appointment.fecha + 'T' + appointment.horaInicio);
    const now = new Date();
    const timeDiff = appointmentDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);

    return hoursDiff > 24; // Permitir cancelar solo si faltan más de 24 horas
  };

  // Separar citas próximas y pasadas
  const now = new Date();
  const upcomingAppointments = appointments.filter(apt => {
    const appointmentDate = new Date(apt.fecha + 'T' + apt.horaInicio);
    return appointmentDate > now;
  });

  const pastAppointments = appointments.filter(apt => {
    const appointmentDate = new Date(apt.fecha + 'T' + apt.horaInicio);
    return appointmentDate <= now;
  });

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Cargando citas...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Mis Citas
      </Typography>

      {/* Próximas citas */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2, color: 'primary.main', fontWeight: 'bold' }}>
          Próximas Citas ({upcomingAppointments.length})
        </Typography>
        
        {upcomingAppointments.length === 0 ? (
          <Card>
            <CardContent>
              <Typography color="text.secondary" textAlign="center">
                No tienes citas próximas. ¡Reserva una nueva cita!
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={2}>
            {upcomingAppointments.map((appointment) => (
              <Card key={appointment._id} sx={{ 
                border: appointment.estado === 'pendiente' ? '2px solid #ff9800' : '1px solid #e0e0e0',
                '&:hover': { boxShadow: 3 }
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
                        />
                      </Stack>
                      
                      <Stack spacing={1}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <PersonIcon color="action" fontSize="small" />
                          <Typography variant="body2">
                            Con: {appointment.peluquero.nombre}
                          </Typography>
                        </Stack>
                        
                        <Stack direction="row" spacing={1} alignItems="center">
                          <TimeIcon color="action" fontSize="small" />
                          <Typography variant="body2">
                            {formatDate(appointment.fecha)} a las {formatTime(appointment.horaInicio)}
                          </Typography>
                        </Stack>
                        
                        {appointment.notas && (
                          <Stack direction="row" spacing={1} alignItems="flex-start">
                            <NoteIcon color="action" fontSize="small" />
                            <Typography variant="body2" color="text.secondary">
                              {appointment.notas}
                            </Typography>
                          </Stack>
                        )}
                      </Stack>
                    </Box>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                        €{appointment.precio}
                      </Typography>
                      <IconButton 
                        onClick={(e) => handleMenuClick(e, appointment)}
                        size="small"
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>

      {/* Historial */}
      <Box>
        <Typography variant="h5" sx={{ mb: 2, color: 'text.secondary', fontWeight: 'bold' }}>
          Historial ({pastAppointments.length})
        </Typography>
        
        {pastAppointments.length === 0 ? (
          <Card>
            <CardContent>
              <Typography color="text.secondary" textAlign="center">
                No tienes citas en el historial aún.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={2}>
            {pastAppointments.map((appointment) => (
              <Card key={appointment._id} sx={{ opacity: 0.7 }}>
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
                        />
                      </Stack>
                      
                      <Stack spacing={1}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <PersonIcon color="action" fontSize="small" />
                          <Typography variant="body2">
                            Con: {appointment.peluquero.nombre}
                          </Typography>
                        </Stack>
                        
                        <Stack direction="row" spacing={1} alignItems="center">
                          <TimeIcon color="action" fontSize="small" />
                          <Typography variant="body2">
                            {formatDate(appointment.fecha)} a las {formatTime(appointment.horaInicio)}
                          </Typography>
                        </Stack>
                        
                        {appointment.notas && (
                          <Stack direction="row" spacing={1} alignItems="flex-start">
                            <NoteIcon color="action" fontSize="small" />
                            <Typography variant="body2" color="text.secondary">
                              {appointment.notas}
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
            ))}
          </Stack>
        )}
      </Box>

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
      <Dialog open={showCancelDialog} onClose={() => setShowCancelDialog(false)}>
        <DialogTitle>Confirmar Cancelación</DialogTitle>
        <DialogContent>
          {selectedAppointment && (
            <Box>
              <Typography sx={{ mb: 2 }}>
                ¿Estás seguro de que quieres cancelar esta cita?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Servicio:</strong> {selectedAppointment.servicio.nombre}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Fecha:</strong> {formatDate(selectedAppointment.fecha)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Hora:</strong> {formatTime(selectedAppointment.horaInicio)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Peluquero:</strong> {selectedAppointment.peluquero.nombre}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCancelDialog(false)}>
            No, mantener cita
          </Button>
          <Button 
            onClick={() => selectedAppointment && handleCancelAppointment(selectedAppointment._id)}
            variant="contained"
            color="error"
          >
            Sí, cancelar cita
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyAppointments;
