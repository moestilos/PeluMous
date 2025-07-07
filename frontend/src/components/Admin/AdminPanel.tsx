import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Alert,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

interface Peluquero {
  _id: string;
  nombre: string;
  email: string;
  telefono: string;
  activo?: boolean;
}

interface PeluqueroForm {
  nombre: string;
  email: string;
  password: string;
  telefono: string;
}

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [peluqueros, setPeluqueros] = useState<Peluquero[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPeluquero, setEditingPeluquero] = useState<Peluquero | null>(null);
  const [formData, setFormData] = useState<PeluqueroForm>({
    nombre: '',
    email: '',
    password: '',
    telefono: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.rol === 'admin') {
      fetchPeluqueros();
    }
  }, [user]);

  const fetchPeluqueros = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      const peluquerosData = response.data.filter((u: any) => u.rol === 'peluquero');
      setPeluqueros(peluquerosData);
    } catch (error) {
      setError('Error al cargar peluqueros');
    }
  };

  const handleOpenDialog = (peluquero?: Peluquero) => {
    if (peluquero) {
      setEditingPeluquero(peluquero);
      setFormData({
        nombre: peluquero.nombre,
        email: peluquero.email,
        password: '',
        telefono: peluquero.telefono
      });
    } else {
      setEditingPeluquero(null);
      setFormData({
        nombre: '',
        email: '',
        password: '',
        telefono: ''
      });
    }
    setOpenDialog(true);
    setError('');
    setSuccess('');
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPeluquero(null);
    setFormData({
      nombre: '',
      email: '',
      password: '',
      telefono: ''
    });
    setError('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      if (editingPeluquero) {
        // Actualizar peluquero
        const updateData = {
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono
        };
        
        await axios.put(`http://localhost:5000/api/users/peluqueros/${editingPeluquero._id}`, updateData);
        setSuccess('Peluquero actualizado correctamente');
      } else {
        // Crear nuevo peluquero
        await axios.post('http://localhost:5000/api/users/peluqueros', formData);
        setSuccess('Peluquero creado correctamente');
      }

      await fetchPeluqueros();
      handleCloseDialog();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Error al guardar peluquero');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres desactivar este peluquero?')) {
      try {
        await axios.delete(`http://localhost:5000/api/users/peluqueros/${id}`);
        setSuccess('Peluquero desactivado correctamente');
        await fetchPeluqueros();
      } catch (error: any) {
        setError(error.response?.data?.message || 'Error al desactivar peluquero');
      }
    }
  };

  if (user?.rol !== 'admin') {
    return (
      <Container>
        <Alert severity="error">
          No tienes permisos para acceder a esta página
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Panel de Administración
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Peluquero
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        Gestión de Peluqueros
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {peluqueros.map((peluquero) => (
              <TableRow key={peluquero._id}>
                <TableCell>{peluquero.nombre}</TableCell>
                <TableCell>{peluquero.email}</TableCell>
                <TableCell>{peluquero.telefono}</TableCell>
                <TableCell>
                  <Chip
                    label={peluquero.activo !== false ? 'Activo' : 'Inactivo'}
                    color={peluquero.activo !== false ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() => handleOpenDialog(peluquero)}
                    color="primary"
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeactivate(peluquero._id)}
                    color="error"
                    size="small"
                    disabled={peluquero.activo === false}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para crear/editar peluquero */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingPeluquero ? 'Editar Peluquero' : 'Nuevo Peluquero'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Teléfono"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              required
            />
            {!editingPeluquero && (
              <TextField
                fullWidth
                label="Contraseña"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPanel;
