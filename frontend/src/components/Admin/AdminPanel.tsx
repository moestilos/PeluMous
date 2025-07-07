import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Avatar,
  Card,
  CardContent,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  alpha,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Group,
  AdminPanelSettings,
  TrendingUp,
  ContentCut,
  Dashboard as DashboardIcon
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

interface Usuario {
  _id: string;
  nombre: string;
  email: string;
  telefono: string;
  rol: 'cliente' | 'peluquero' | 'admin';
  activo?: boolean;
  createdAt?: string;
  profileImage?: string;
}

interface PeluqueroForm {
  nombre: string;
  email: string;
  password: string;
  telefono: string;
}

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const section = searchParams.get('section') || 'overview';
  
  const [peluqueros, setPeluqueros] = useState<Peluquero[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState<Usuario[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'cliente' | 'peluquero'>('all');
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
      fetchUsuarios();
    }
  }, [user]);

  const filterUsuarios = React.useCallback(() => {
    let filtered = usuarios;

    // Filtro por rol
    if (roleFilter !== 'all') {
      filtered = filtered.filter(usuario => usuario.rol === roleFilter);
    }

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(usuario => 
        usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.telefono.includes(searchTerm)
      );
    }

    setFilteredUsuarios(filtered);
  }, [usuarios, searchTerm, roleFilter]);

  useEffect(() => {
    filterUsuarios();
  }, [filterUsuarios]);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      const usuariosData = response.data.filter((u: any) => u.rol !== 'admin');
      setUsuarios(usuariosData);
    } catch (error) {
      setError('Error al cargar usuarios');
    }
  };

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
  const renderUsuariosSection = () => (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ 
          color: '#000000', 
          fontWeight: 700,
          mb: 1,
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          letterSpacing: '-0.025em'
        }}>
          Gestión de Usuarios
        </Typography>
        <Typography variant="body1" sx={{ 
          color: '#666666',
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          fontWeight: 400
        }}>
          Administra y supervisa todos los usuarios del sistema
        </Typography>
      </Box>

      {/* Controls */}
      <Card sx={{ 
        mb: 4, 
        backgroundColor: '#ffffff',
        border: '2px solid #000000',
        borderRadius: 2,
        boxShadow: '4px 4px 0px #000000'
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            gap: 3, 
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            {/* Search */}
            <TextField
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#9ca3af' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                flexGrow: 1, 
                minWidth: 300,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f9fafb',
                  borderRadius: 1.5,
                  border: '1px solid #e5e7eb',
                  color: '#000000',
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#d1d5db'
                    }
                  },
                  '&.Mui-focused': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#000000',
                      borderWidth: 1
                    }
                  }
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none'
                },
                '& .MuiInputBase-input::placeholder': {
                  color: '#9ca3af',
                  opacity: 1
                }
              }}
            />

            {/* Role Filter */}
            <ToggleButtonGroup
              value={roleFilter}
              exclusive
              onChange={(e, newFilter) => newFilter && setRoleFilter(newFilter)}
              sx={{ 
                '& .MuiToggleButton-root': {
                  borderRadius: 1.5,
                  px: 3,
                  py: 1.5,
                  fontWeight: 500,
                  textTransform: 'none',
                  border: '1px solid #e5e7eb',
                  color: '#6b7280',
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  '&.Mui-selected': {
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    borderColor: '#000000',
                    '&:hover': {
                      backgroundColor: '#1f2937'
                    }
                  },
                  '&:hover': {
                    backgroundColor: '#f9fafb',
                    borderColor: '#d1d5db'
                  }
                }
              }}
            >
              <ToggleButton value="all">
                Todos
              </ToggleButton>
              <ToggleButton value="cliente">
                Clientes
              </ToggleButton>
              <ToggleButton value="peluquero">
                Peluqueros
              </ToggleButton>
            </ToggleButtonGroup>

            {/* Stats */}
            <Box sx={{
              backgroundColor: '#f3f4f6',
              border: '1px solid #e5e7eb',
              borderRadius: 1.5,
              px: 3,
              py: 1.5
            }}>
              <Typography variant="body2" sx={{ 
                color: '#000000',
                fontWeight: 600,
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
              }}>
                {filteredUsuarios.length} {filteredUsuarios.length === 1 ? 'usuario' : 'usuarios'}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Users Table */}
      <TableContainer component={Paper} sx={{ 
        backgroundColor: '#ffffff',
        border: '2px solid #000000',
        borderRadius: 2,
        boxShadow: '4px 4px 0px #000000'
      }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f9fafb' }}>
              <TableCell sx={{ 
                color: '#374151', 
                fontWeight: 600,
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                borderBottom: '1px solid #e5e7eb'
              }}>
                Usuario
              </TableCell>
              <TableCell sx={{ 
                color: '#374151', 
                fontWeight: 600,
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                borderBottom: '1px solid #e5e7eb'
              }}>
                Email
              </TableCell>
              <TableCell sx={{ 
                color: '#374151', 
                fontWeight: 600,
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                borderBottom: '1px solid #e5e7eb'
              }}>
                Teléfono
              </TableCell>
              <TableCell sx={{ 
                color: '#374151', 
                fontWeight: 600,
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                borderBottom: '1px solid #e5e7eb'
              }}>
                Rol
              </TableCell>
              <TableCell sx={{ 
                color: '#374151', 
                fontWeight: 600,
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                borderBottom: '1px solid #e5e7eb'
              }}>
                Estado
              </TableCell>
              <TableCell sx={{ 
                color: '#374151', 
                fontWeight: 600,
                fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                borderBottom: '1px solid #e5e7eb'
              }}>
                Registro
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsuarios.map((usuario, index) => (
              <TableRow 
                key={usuario._id}
                sx={{ 
                  '&:hover': { backgroundColor: '#f9fafb' },
                  transition: 'background-color 0.2s ease'
                }}
              >
                <TableCell sx={{ 
                  borderBottom: '1px solid #f3f4f6',
                  py: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      src={usuario.profileImage ? `http://localhost:5000${usuario.profileImage}` : undefined}
                      sx={{ 
                        width: 40, 
                        height: 40,
                        backgroundColor: '#e5e7eb',
                        color: '#374151',
                        fontSize: '1rem',
                        fontWeight: 600
                      }}
                    >
                      {!usuario.profileImage && usuario.nombre.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="body2" sx={{ 
                      fontWeight: 600, 
                      color: '#111827',
                      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                    }}>
                      {usuario.nombre}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ 
                  borderBottom: '1px solid #f3f4f6',
                  color: '#6b7280',
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                }}>
                  {usuario.email}
                </TableCell>
                <TableCell sx={{ 
                  borderBottom: '1px solid #f3f4f6',
                  color: '#6b7280',
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                }}>
                  {usuario.telefono}
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid #f3f4f6' }}>
                  <Chip
                    label={usuario.rol === 'cliente' ? 'Cliente' : 'Peluquero'}
                    size="small"
                    sx={{
                      backgroundColor: usuario.rol === 'cliente' ? '#dbeafe' : '#f3e8ff',
                      color: usuario.rol === 'cliente' ? '#1e40af' : '#7c3aed',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                    }}
                  />
                </TableCell>
                <TableCell sx={{ borderBottom: '1px solid #f3f4f6' }}>
                  <Chip
                    label={usuario.activo !== false ? 'Activo' : 'Inactivo'}
                    size="small"
                    sx={{
                      backgroundColor: usuario.activo !== false ? '#dcfce7' : '#fee2e2',
                      color: usuario.activo !== false ? '#166534' : '#dc2626',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                    }}
                  />
                </TableCell>
                <TableCell sx={{ 
                  borderBottom: '1px solid #f3f4f6',
                  color: '#6b7280',
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
                }}>
                  {usuario.createdAt ? 
                    new Date(usuario.createdAt).toLocaleDateString('es-ES', { 
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : 'N/A'
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Empty State */}
      {filteredUsuarios.length === 0 && (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8,
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: 2,
          mt: 4
        }}>
          <PersonIcon sx={{ 
            fontSize: 64, 
            color: '#d1d5db', 
            mb: 2 
          }} />
          <Typography variant="h6" sx={{ 
            color: '#6b7280', 
            mb: 1,
            fontWeight: 600,
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
          }}>
            No se encontraron usuarios
          </Typography>
          <Typography variant="body2" sx={{ 
            color: '#9ca3af',
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
          }}>
            {searchTerm || roleFilter !== 'all' 
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'No hay usuarios registrados en el sistema'
            }
          </Typography>
        </Box>
      )}
    </Box>
  );

  const renderPeluquerosSection = () => (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" sx={{ color: '#000000', fontWeight: 700 }}>
          Gestión de Peluqueros
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            backgroundColor: '#000000',
            border: '2px solid #000000',
            boxShadow: '4px 4px 0px #333333',
            borderRadius: 2,
            fontWeight: 700,
            '&:hover': {
              backgroundColor: '#000000',
              transform: 'translate(-2px, -2px)',
              boxShadow: '6px 6px 0px #333333'
            }
          }}
        >
          Nuevo Peluquero
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{
        backgroundColor: '#ffffff',
        border: '2px solid #000000',
        borderRadius: 2,
        boxShadow: '4px 4px 0px #000000'
      }}>
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
    </>
  );

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

  const renderOverviewSection = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header administrativo */}
        <motion.div variants={itemVariants}>
          <Card sx={{
            backgroundColor: '#ffffff !important',
            border: '3px solid #000000 !important',
            borderRadius: '12px !important',
            boxShadow: '8px 8px 0px #000000 !important',
            mb: 4,
            overflow: 'hidden',
            position: 'relative'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" alignItems="center" spacing={3}>
                <Avatar sx={{
                  width: 80,
                  height: 80,
                  background: 'linear-gradient(135deg, #dc2626, #991b1b)',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#ffffff'
                }}>
                  <AdminPanelSettings sx={{ fontSize: 40 }} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 700, 
                    mb: 1,
                    color: '#000000 !important'
                  }}>
                    Panel de Administración
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: '#666666 !important',
                    mb: 2,
                    fontSize: '1.1rem'
                  }}>
                    Control total del sistema y gestión de usuarios
                  </Typography>
                  <Chip
                    icon={<AdminPanelSettings />}
                    label="Administrador"
                    sx={{
                      background: '#dc2626',
                      color: '#ffffff',
                      fontWeight: 600,
                      '& .MuiChip-icon': { color: '#ffffff' }
                    }}
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </motion.div>

        {/* Estadísticas principales */}
        <motion.div variants={itemVariants}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 4 }}>
            <Card sx={{
              flex: 1,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.05)})`,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha('#ffffff', 0.2)}`,
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.15)}`
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Avatar sx={{
                  width: 56,
                  height: 56,
                  background: theme.palette.primary.main,
                  mx: 'auto',
                  mb: 2
                }}>
                  <Group sx={{ fontSize: 28 }} />
                </Avatar>
                <Typography variant="h3" sx={{ 
                  fontWeight: 700, 
                  color: theme.palette.primary.main,
                  mb: 1 
                }}>
                  {usuarios.length}
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: theme.palette.text.secondary,
                  fontWeight: 500 
                }}>
                  Usuarios Totales
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{
              flex: 1,
              background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)}, ${alpha(theme.palette.warning.main, 0.05)})`,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha('#ffffff', 0.2)}`,
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 20px 40px ${alpha(theme.palette.warning.main, 0.15)}`
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Avatar sx={{
                  width: 56,
                  height: 56,
                  background: theme.palette.warning.main,
                  mx: 'auto',
                  mb: 2
                }}>
                  <ContentCut sx={{ fontSize: 28 }} />
                </Avatar>
                <Typography variant="h3" sx={{ 
                  fontWeight: 700, 
                  color: theme.palette.warning.main,
                  mb: 1 
                }}>
                  {peluqueros.length}
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: theme.palette.text.secondary,
                  fontWeight: 500 
                }}>
                  Peluqueros Activos
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{
              flex: 1,
              background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)}, ${alpha(theme.palette.info.main, 0.05)})`,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha('#ffffff', 0.2)}`,
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 20px 40px ${alpha(theme.palette.info.main, 0.15)}`
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Avatar sx={{
                  width: 56,
                  height: 56,
                  background: theme.palette.info.main,
                  mx: 'auto',
                  mb: 2
                }}>
                  <PersonIcon sx={{ fontSize: 28 }} />
                </Avatar>
                <Typography variant="h3" sx={{ 
                  fontWeight: 700, 
                  color: theme.palette.info.main,
                  mb: 1 
                }}>
                  {usuarios.filter(u => u.rol === 'cliente').length}
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: theme.palette.text.secondary,
                  fontWeight: 500 
                }}>
                  Clientes
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{
              flex: 1,
              background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)}, ${alpha(theme.palette.success.main, 0.05)})`,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha('#ffffff', 0.2)}`,
              borderRadius: 3,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 20px 40px ${alpha(theme.palette.success.main, 0.15)}`
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Avatar sx={{
                  width: 56,
                  height: 56,
                  background: theme.palette.success.main,
                  mx: 'auto',
                  mb: 2
                }}>
                  <TrendingUp sx={{ fontSize: 28 }} />
                </Avatar>
                <Typography variant="h3" sx={{ 
                  fontWeight: 700, 
                  color: theme.palette.success.main,
                  mb: 1 
                }}>
                  95%
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: theme.palette.text.secondary,
                  fontWeight: 500 
                }}>
                  Satisfacción
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </motion.div>

        {/* Acciones rápidas */}
        <motion.div variants={itemVariants}>
          <Card sx={{
            background: '#ffffff',
            border: '2px solid #000000',
            borderRadius: 2,
            boxShadow: '4px 4px 0px #000000'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 600, 
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                <DashboardIcon />
                🚀 Acciones Administrativas
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Group />}
                  onClick={() => window.location.href = '/admin?section=users'}
                  sx={{
                    py: 2,
                    px: 4,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`
                    }
                  }}
                >
                  Gestionar Usuarios
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<ContentCut />}
                  onClick={() => handleOpenDialog()}
                  sx={{
                    py: 2,
                    px: 4,
                    '&:hover': {
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Añadir Peluquero
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<TrendingUp />}
                  sx={{
                    py: 2,
                    px: 4,
                    '&:hover': {
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Ver Reportes
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </motion.div>
  );

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundImage: 'url(/img/fondo.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <Container maxWidth="xl" sx={{ pt: section === 'users' ? 0 : 2, pb: 4 }}>
        {section !== 'users' && (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 3,
            color: 'inherit'
          }}>
            <Typography variant="h4" component="h1" sx={{ 
              color: '#000000',
              fontWeight: 700,
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}>
              Panel de Administración
            </Typography>
          </Box>
        )}

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

        {/* Render different sections based on URL parameter */}
        {section === 'users' && renderUsuariosSection()}
        {section === 'overview' && renderOverviewSection()}
        {(!section || section === 'overview') && section !== 'users' && renderPeluquerosSection()}

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
    </Box>
  );
};

export default AdminPanel;
