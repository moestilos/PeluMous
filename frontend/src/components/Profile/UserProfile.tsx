import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Avatar,
  Stack,
  useTheme,
  alpha,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  PhotoCamera,
  Save,
  Edit
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../Notifications/NotificationProvider';
import axios from 'axios';

const UserProfile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showSuccess, showError } = useNotification();
  const theme = useTheme();
  
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    telefono: user?.telefono || ''
  });
  
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(
    user?.profileImage ? `http://localhost:5000${user.profileImage}` : null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showError('La imagen debe ser menor a 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        showError('Solo se permiten archivos de imagen');
        return;
      }

      setImageFile(file);
      
      // Preview image
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Create FormData for multipart upload
      const formDataToSend = new FormData();
      formDataToSend.append('nombre', formData.nombre);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('telefono', formData.telefono);
      
      if (imageFile) {
        formDataToSend.append('profileImage', imageFile);
      }

      const response = await axios.put(`http://localhost:5000/api/users/profile`, formDataToSend, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // Actualizar el usuario en el contexto
      if (response.data.user) {
        updateUser(response.data.user);
        
        // Actualizar el estado local
        setFormData({
          nombre: response.data.user.nombre,
          email: response.data.user.email,
          telefono: response.data.user.telefono
        });

        // Actualizar la imagen de perfil si se subió una nueva
        if (response.data.user.profileImage) {
          setProfileImage(`http://localhost:5000${response.data.user.profileImage}`);
        }
      }

      showSuccess('Perfil actualizado exitosamente');
      setImageFile(null); // Limpiar archivo temporal
    } catch (error: any) {
      showError(error.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'peluquero':
        return 'Peluquero';
      case 'cliente':
        return 'Cliente';
      default:
        return 'Usuario';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return theme.palette.error.main;
      case 'peluquero':
        return theme.palette.warning.main;
      case 'cliente':
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
        {/* Header */}
        <motion.div variants={itemVariants}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
            <Avatar sx={{ 
              width: 60, 
              height: 60,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
            }}>
              <Person sx={{ fontSize: 30 }} />
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
                Mi Perfil
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Gestiona tu información personal
              </Typography>
            </Box>
          </Stack>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Foto de Perfil */}
            <motion.div variants={itemVariants}>
              <Card sx={{
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.paper, 0.9)})`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.1)}`
                }
              }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    📸 Foto de Perfil
                  </Typography>
                  
                  <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                    <Avatar
                      src={profileImage || undefined}
                      sx={{
                        width: 120,
                        height: 120,
                        mx: 'auto',
                        background: `linear-gradient(135deg, ${getRoleColor(user?.rol || '')}, ${alpha(getRoleColor(user?.rol || ''), 0.7)})`,
                        fontSize: '3rem'
                      }}
                    >
                      {!profileImage && user?.nombre.charAt(0)}
                    </Avatar>
                    
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="profile-image-upload"
                      type="file"
                      onChange={handleImageChange}
                    />
                    <label htmlFor="profile-image-upload">
                      <IconButton
                        component="span"
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          background: theme.palette.primary.main,
                          color: 'white',
                          '&:hover': {
                            background: theme.palette.primary.dark,
                            transform: 'scale(1.1)'
                          }
                        }}
                      >
                        <PhotoCamera />
                      </IconButton>
                    </label>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary">
                    Haz clic en el ícono de cámara para cambiar tu foto de perfil
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                    Formatos soportados: JPG, PNG, GIF • Tamaño máximo: 5MB
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>

            {/* Información Personal */}
            <motion.div variants={itemVariants}>
              <Card sx={{
                background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.paper, 0.9)})`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: `0 8px 32px ${alpha(theme.palette.secondary.main, 0.1)}`
                }
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                    <Avatar sx={{
                      background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                      width: 48,
                      height: 48
                    }}>
                      <Edit />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Información Personal
                    </Typography>
                  </Stack>

                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      label="Nombre completo"
                      value={formData.nombre}
                      onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                      InputProps={{
                        startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Correo electrónico"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      InputProps={{
                        startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Teléfono"
                      value={formData.telefono}
                      onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                      InputProps={{
                        startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>

            {/* Información del Rol */}
            <motion.div variants={itemVariants}>
              <Card sx={{
                background: `linear-gradient(135deg, ${alpha(getRoleColor(user?.rol || ''), 0.1)}, ${alpha(getRoleColor(user?.rol || ''), 0.05)})`,
                border: `1px solid ${alpha(getRoleColor(user?.rol || ''), 0.2)}`
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Alert 
                    severity="info" 
                    sx={{ 
                      background: 'transparent',
                      border: 'none',
                      '& .MuiAlert-icon': {
                        color: getRoleColor(user?.rol || '')
                      }
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Rol actual: {getRoleLabel(user?.rol || '')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tu rol determina los permisos y funcionalidades disponibles en el sistema
                    </Typography>
                  </Alert>
                </CardContent>
              </Card>
            </motion.div>

            {/* Botón de Guardar */}
            <motion.div variants={itemVariants}>
              <Card sx={{
                background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                position: 'relative',
                overflow: 'hidden'
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{
                      background: 'rgba(255,255,255,0.2)',
                      width: 48,
                      height: 48
                    }}>
                      <Save sx={{ color: 'white' }} />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                        Guardar Cambios
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                        Actualiza tu información personal
                      </Typography>
                    </Box>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                      sx={{
                        background: 'white',
                        color: theme.palette.success.main,
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        '&:hover': {
                          background: 'rgba(255,255,255,0.9)',
                          transform: 'translateY(-2px)'
                        },
                        '&:disabled': {
                          background: 'rgba(255,255,255,0.5)',
                          color: 'rgba(76, 175, 80, 0.5)'
                        }
                      }}
                    >
                      {loading ? 'Guardando...' : 'Guardar'}
                    </Button>
                  </Stack>
                </CardContent>
                
                {/* Elemento decorativo */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -20,
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

export default UserProfile;
