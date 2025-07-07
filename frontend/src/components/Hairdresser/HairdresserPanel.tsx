import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

interface Appointment {
  _id: string;
  client: {
    name: string;
    email: string;
    phone?: string;
  };
  service: {
    name: string;
    duration: number;
    price: number;
  };
  hairdresser: {
    name: string;
  };
  dateTime: string;
  status: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  notes?: string;
}

const HairdresserPanel: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updateDialog, setUpdateDialog] = useState<{
    open: boolean;
    appointment: Appointment | null;
    newStatus: string;
    notes: string;
  }>({
    open: false,
    appointment: null,
    newStatus: '',
    notes: ''
  });

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/appointments/hairdresser/my-appointments', {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

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
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    
    return `${dayName}, ${day} de ${month}`;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleOpenUpdateDialog = (appointment: Appointment) => {
    setUpdateDialog({
      open: true,
      appointment,
      newStatus: appointment.status,
      notes: appointment.notes || ''
    });
  };

  const handleCloseUpdateDialog = () => {
    setUpdateDialog({
      open: false,
      appointment: null,
      newStatus: '',
      notes: ''
    });
  };

  const handleUpdateAppointment = async () => {
    if (!updateDialog.appointment) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/appointments/${updateDialog.appointment._id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          estado: updateDialog.newStatus,
          notas: updateDialog.notes
        })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar la cita');
      }

      setSuccess('Cita actualizada correctamente');
      setError(null);
      handleCloseUpdateDialog();
      fetchAppointments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.dateTime).toISOString().split('T')[0];
    const matchesDate = selectedDate === '' || appointmentDate === selectedDate;
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    return matchesDate && matchesStatus;
  });

  const todayAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.dateTime).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    return appointmentDate === today;
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
        Panel del Peluquero
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* Resumen del día */}
      <Card sx={{ 
        mb: 3, 
        backgroundColor: '#ffffff !important',
        border: '3px solid #000000 !important',
        borderRadius: '12px !important',
        boxShadow: '8px 8px 0px #000000 !important',
        color: '#000000 !important'
      }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Citas de Hoy
          </Typography>
          <Stack direction="row" spacing={3}>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {todayAppointments.length}
              </Typography>
              <Typography variant="body2">Total</Typography>
            </Box>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {todayAppointments.filter(a => a.status === 'pendiente').length}
              </Typography>
              <Typography variant="body2">Pendientes</Typography>
            </Box>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {todayAppointments.filter(a => a.status === 'confirmada').length}
              </Typography>
              <Typography variant="body2">Confirmadas</Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
            <TextField
              type="date"
              label="Fecha"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 200 }}
            />
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel>Estado</InputLabel>
              <Select
                value={statusFilter}
                label="Estado"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="pendiente">Pendiente</MenuItem>
                <MenuItem value="confirmada">Confirmada</MenuItem>
                <MenuItem value="completada">Completada</MenuItem>
                <MenuItem value="cancelada">Cancelada</MenuItem>
              </Select>
            </FormControl>
            <Button 
              variant="outlined" 
              onClick={() => {
                setSelectedDate('');
                setStatusFilter('all');
              }}
            >
              Limpiar Filtros
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Lista de citas */}
      <Stack spacing={2}>
        {filteredAppointments.length === 0 ? (
          <Card>
            <CardContent>
              <Typography color="text.secondary" textAlign="center">
                No hay citas para los filtros seleccionados
              </Typography>
            </CardContent>
          </Card>
        ) : (
          filteredAppointments.map((appointment) => (
            <Card key={appointment._id} sx={{ 
              border: appointment.status === 'pendiente' ? '2px solid #ff9800' : '1px solid #e0e0e0',
              '&:hover': { boxShadow: 3 }
            }}>
              <CardContent>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="flex-start">
                  <Box sx={{ flex: '0 0 auto', minWidth: { xs: '100%', md: '200px' } }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {formatDate(appointment.dateTime)}
                    </Typography>
                    <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                      {formatTime(appointment.dateTime)}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {appointment.client.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {appointment.client.email}
                    </Typography>
                    {appointment.client.phone && (
                      <Typography variant="body2" color="text.secondary">
                        {appointment.client.phone}
                      </Typography>
                    )}
                  </Box>
                  
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {appointment.service.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {appointment.service.duration} min - €{appointment.service.price}
                    </Typography>
                    {appointment.notes && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontStyle: 'italic' }}>
                        Notas: {appointment.notes}
                      </Typography>
                    )}
                  </Box>
                  
                  <Box sx={{ flex: '0 0 auto', minWidth: { xs: '100%', md: '120px' } }}>
                    <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
                      <Chip 
                        label={getStatusText(appointment.status)}
                        color={getStatusColor(appointment.status) as any}
                        size="small"
                      />
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenUpdateDialog(appointment)}
                        disabled={appointment.status === 'cancelada'}
                      >
                        Gestionar
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))
        )}
      </Stack>

      {/* Dialog para actualizar cita */}
      <Dialog open={updateDialog.open} onClose={handleCloseUpdateDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Gestionar Cita</DialogTitle>
        <DialogContent>
          {updateDialog.appointment && (
            <Stack spacing={3} sx={{ mt: 1 }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  Cliente: {updateDialog.appointment.client.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Servicio: {updateDialog.appointment.service.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fecha: {formatDate(updateDialog.appointment.dateTime)} a las {formatTime(updateDialog.appointment.dateTime)}
                </Typography>
              </Box>
              
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={updateDialog.newStatus}
                  label="Estado"
                  onChange={(e) => setUpdateDialog(prev => ({ ...prev, newStatus: e.target.value }))}
                >
                  <MenuItem value="pendiente">Pendiente</MenuItem>
                  <MenuItem value="confirmada">Confirmada</MenuItem>
                  <MenuItem value="completada">Completada</MenuItem>
                  <MenuItem value="cancelada">Cancelada</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notas adicionales"
                value={updateDialog.notes}
                onChange={(e) => setUpdateDialog(prev => ({ ...prev, notes: e.target.value }))}
              />
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog}>Cancelar</Button>
          <Button onClick={handleUpdateAppointment} variant="contained">
            Actualizar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HairdresserPanel;
