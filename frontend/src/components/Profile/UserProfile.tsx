import React, { useState, useEffect } from 'react';
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
  CircularProgress,
  IconButton,
  Container,
  Chip,
  alpha
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  PhotoCamera,
  Save,
  Edit,
  Badge,
  Star
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../Notifications/NotificationProvider';
import axios from 'axios';

const UserProfile: React.FC = () => {
  const { user, updateUser, refreshUserProfile } = useAuth();
  const { showSuccess, showError } = useNotification();
  const theme = useTheme();
  
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    telefono: user?.telefono || ''
  });
  
  const [errors, setErrors] = useState({
    nombre: '',
    email: '',
    telefono: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(
    user?.profileImage ? `http://localhost:5000${user.profileImage}` : null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Efecto para actualizar el estado cuando el usuario cambie
  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        email: user.email || '',
        telefono: user.telefono || ''
      });
      const imageUrl = user.profileImage ? `http://localhost:5000${user.profileImage}` : null;
      setProfileImage(imageUrl);
    }
  }, [user]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
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

  // Validar campo individual
  const validateField = (name: string, value: string) => {
    let error = '';
    
    switch (name) {
      case 'nombre':
        if (!value.trim()) {
          error = 'El nombre es obligatorio';
        } else if (value.trim().length < 2) {
          error = 'El nombre debe tener al menos 2 caracteres';
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = 'El email es obligatorio';
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            error = 'Por favor ingresa un email válido';
          }
        }
        break;
      case 'telefono':
        if (!value.trim()) {
          error = 'El teléfono es obligatorio';
        } else if (value.trim().length < 8) {
          error = 'El teléfono debe tener al menos 8 dígitos';
        }
        break;
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
    return error === '';
  };

  // Manejar cambios en los campos
  const handleFieldChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Validar después de un pequeño delay para mejor UX
    setTimeout(() => validateField(name, value), 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validar todos los campos antes de enviar
      const nombreValid = validateField('nombre', formData.nombre);
      const emailValid = validateField('email', formData.email);
      const telefonoValid = validateField('telefono', formData.telefono);
      
      if (!nombreValid || !emailValid || !telefonoValid) {
        showError('❌ Por favor corrige los errores en el formulario');
        setLoading(false);
        return;
      }
      
      const token = localStorage.getItem('token');
      
      // Verificar si el email ha cambiado
      const isEmailChanged = formData.email.trim().toLowerCase() !== user?.email?.toLowerCase();
      
      // Create FormData for multipart upload
      const formDataToSend = new FormData();
      formDataToSend.append('nombre', formData.nombre.trim());
      
      // Solo incluir el email si ha cambiado
      if (isEmailChanged) {
        formDataToSend.append('email', formData.email.trim().toLowerCase());
      } else {
        // Si el email no ha cambiado, mantener el original
        formDataToSend.append('email', user?.email || '');
      }
      
      formDataToSend.append('telefono', formData.telefono.trim());
      
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
        // Primero actualizar el contexto con la respuesta del servidor
        updateUser(response.data.user);
        
        // Actualizar el estado local del formulario
        setFormData({
          nombre: response.data.user.nombre,
          email: response.data.user.email,
          telefono: response.data.user.telefono
        });

        // Limpiar errores
        setErrors({ nombre: '', email: '', telefono: '' });

        // Actualizar la imagen de perfil si se subió una nueva
        if (response.data.user.profileImage) {
          const imageUrl = `http://localhost:5000${response.data.user.profileImage}`;
          setProfileImage(imageUrl);
        }
        
        // Refrescar el perfil del usuario desde el servidor para asegurar persistencia
        try {
          await refreshUserProfile();
        } catch (refreshError) {
          console.error('Error al refrescar el perfil:', refreshError);
        }
      }

      // Mensaje de éxito específico
      const successMessage = isEmailChanged ? 
        '✅ Perfil actualizado exitosamente (incluido el email)' : 
        '✅ Perfil actualizado exitosamente';
      
      showSuccess(successMessage);
      setImageFile(null); // Limpiar archivo temporal
    } catch (error: any) {
      console.error('Error completo:', error);
      
      // Manejar diferentes tipos de errores
      let errorMessage = 'Error al actualizar el perfil';
      
      if (error.response) {
        // Error del servidor
        const serverMessage = error.response.data?.message || error.response.data?.error;
        
        if (serverMessage) {
          // Mejorar mensajes de error específicos
          if (serverMessage.includes('usuario con ese email') || serverMessage.includes('email ya existe') || serverMessage.includes('Ya existe un usuario con ese ema')) {
            const isEmailChanged = formData.email.trim().toLowerCase() !== user?.email?.toLowerCase();
            if (isEmailChanged) {
              errorMessage = '❌ Este email ya está en uso por otro usuario. Por favor elige un email diferente.';
            } else {
              // Si el email es el mismo, pero hay error de duplicado, intentar actualizar solo otros campos
              console.log('Email duplicado detectado para el mismo usuario - intentando actualizar solo otros campos');
              errorMessage = '⚠️ No se pudo actualizar el email. Se actualizaron los otros campos correctamente.';
              // Intentar actualizar sin cambiar el email
              handleUpdateWithoutEmail();
              return;
            }
          } else if (serverMessage.includes('email')) {
            errorMessage = '❌ Error con el email: ' + serverMessage;
          } else if (serverMessage.includes('token') || serverMessage.includes('authorization')) {
            errorMessage = '❌ Sesión expirada. Por favor inicia sesión nuevamente';
            // Opcional: redirigir al login
            setTimeout(() => {
              window.location.href = '/auth';
            }, 2000);
          } else {
            errorMessage = '❌ ' + serverMessage;
          }
        } else {
          errorMessage = `❌ Error del servidor (${error.response.status}). Por favor intenta nuevamente.`;
        }
      } else if (error.request) {
        // Error de red
        errorMessage = '❌ Error de conexión. Verifica tu conexión a internet y que el servidor esté funcionando.';
      }
      
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar perfil sin cambiar el email
  const handleUpdateWithoutEmail = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Create FormData solo con nombre y telefono
      const formDataToSend = new FormData();
      formDataToSend.append('nombre', formData.nombre.trim());
      formDataToSend.append('telefono', formData.telefono.trim());
      // Mantener el email original del usuario
      formDataToSend.append('email', user?.email || '');
      
      if (imageFile) {
        formDataToSend.append('profileImage', imageFile);
      }
      
      const response = await axios.put(
        'http://localhost:5000/api/users/profile',
        formDataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      if (response.data.success) {
        // Actualizar contexto del usuario
        updateUser(response.data.user);
        
        // Actualizar el estado local del formulario
        setFormData({
          nombre: response.data.user.nombre,
          email: response.data.user.email,
          telefono: response.data.user.telefono
        });
        
        // Limpiar errores
        setErrors({ nombre: '', email: '', telefono: '' });
        
        // Actualizar la imagen de perfil si se subió una nueva
        if (response.data.user.profileImage) {
          const imageUrl = `http://localhost:5000${response.data.user.profileImage}`;
          setProfileImage(imageUrl);
        }
        
        // Refrescar el perfil del usuario
        try {
          await refreshUserProfile();
        } catch (refreshError) {
          console.error('Error al refrescar el perfil:', refreshError);
        }
        
        showSuccess('✅ Perfil actualizado exitosamente (excepto el email)');
        setImageFile(null);
      }
    } catch (error) {
      console.error('Error al actualizar perfil sin email:', error);
      showError('❌ Error al actualizar el perfil. Por favor intenta nuevamente.');
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
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header mejorado */}
        <motion.div variants={itemVariants}>
          <Card sx={{
            backgroundColor: '#ffffff !important',
            border: '3px solid #000000 !important',
            borderRadius: '12px !important',
            boxShadow: '8px 8px 0px #000000 !important',
            mb: 4,
            overflow: 'hidden'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" alignItems="center" spacing={3}>
                <Avatar sx={{
                  width: 80,
                  height: 80,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: '#ffffff'
                }}>
                  <Person sx={{ fontSize: 40 }} />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 700, 
                    mb: 1,
                    color: '#000000 !important'
                  }}>
                    Mi Perfil
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: '#666666 !important',
                    mb: 2,
                    fontSize: '1.1rem'
                  }}>
                    Gestiona tu información personal y configuración
                  </Typography>
                  <Chip
                    icon={<Badge />}
                    label={getRoleLabel(user?.rol || '')}
                    sx={{
                      background: getRoleColor(user?.rol || ''),
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

        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            {/* Foto de Perfil con glassmorphism */}
            <motion.div variants={itemVariants}>
              <Card sx={{
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.05)})`,
                backdropFilter: 'blur(20px)',
                border: `1px solid ${alpha('#ffffff', 0.2)}`,
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.1)}`
                }
              }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 600, 
                    mb: 3, 
                    color: theme.palette.primary.main,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1
                  }}>
                    <PhotoCamera />
                    Foto de Perfil
                  </Typography>
                  
                  <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                    <Avatar
                      src={profileImage || undefined}
                      sx={{
                        width: 160,
                        height: 160,
                        mx: 'auto',
                        background: getRoleColor(user?.rol || ''),
                        fontSize: '4rem',
                        fontWeight: 'bold',
                        border: '4px solid #ffffff',
                        boxShadow: `0 8px 25px ${alpha(getRoleColor(user?.rol || ''), 0.3)}`
                      }}
                      onError={() => setProfileImage(null)}
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
                          bottom: 8,
                          right: 8,
                          backgroundColor: theme.palette.primary.main,
                          color: '#ffffff !important',
                          width: 48,
                          height: 48,
                          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
                          '&:hover': {
                            backgroundColor: theme.palette.primary.dark,
                            transform: 'scale(1.1)'
                          }
                        }}
                      >
                        <PhotoCamera />
                      </IconButton>
                    </label>
                  </Box>
                  
                  <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
                    Haz clic en el ícono de cámara para cambiar tu foto
                  </Typography>
                  <Typography variant="caption" sx={{ 
                    color: theme.palette.text.secondary,
                    display: 'block',
                    backgroundColor: alpha(theme.palette.warning.main, 0.1),
                    padding: 1,
                    borderRadius: 1,
                    border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
                  }}>
                    📋 Formatos: JPG, PNG, GIF • Tamaño máximo: 5MB
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>

            {/* Información Personal con glassmorphism */}
            <motion.div variants={itemVariants}>
              <Card sx={{
                background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
                backdropFilter: 'blur(20px)',
                border: `1px solid ${alpha('#ffffff', 0.2)}`,
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 20px 40px ${alpha(theme.palette.secondary.main, 0.1)}`
                }
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 600, 
                    mb: 3, 
                    color: theme.palette.secondary.main,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <Edit />
                    Información Personal
                  </Typography>
                  
                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      label="Nombre completo"
                      value={formData.nombre}
                      onChange={(e) => handleFieldChange('nombre', e.target.value)}
                      error={!!errors.nombre}
                      helperText={errors.nombre}
                      InputProps={{
                        startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: alpha('#ffffff', 0.8),
                          '&:hover': {
                            backgroundColor: alpha('#ffffff', 0.9)
                          }
                        }
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Correo electrónico"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      error={!!errors.email}
                      helperText={errors.email}
                      InputProps={{
                        startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: alpha('#ffffff', 0.8),
                          '&:hover': {
                            backgroundColor: alpha('#ffffff', 0.9)
                          }
                        }
                      }}
                    />

                    <TextField
                      fullWidth
                      label="Teléfono"
                      value={formData.telefono}
                      onChange={(e) => handleFieldChange('telefono', e.target.value)}
                      error={!!errors.telefono}
                      helperText={errors.telefono}
                      InputProps={{
                        startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: alpha('#ffffff', 0.8),
                          '&:hover': {
                            backgroundColor: alpha('#ffffff', 0.9)
                          }
                        }
                      }}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>

            {/* Información del Rol con glassmorphism */}
            <motion.div variants={itemVariants}>
              <Card sx={{
                background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)}, ${alpha(theme.palette.info.main, 0.05)})`,
                backdropFilter: 'blur(20px)',
                border: `1px solid ${alpha('#ffffff', 0.2)}`,
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 20px 40px ${alpha(theme.palette.info.main, 0.1)}`
                }
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Stack direction="row" alignItems="center" spacing={3}>
                    <Avatar sx={{
                      backgroundColor: getRoleColor(user?.rol || ''),
                      width: 60,
                      height: 60,
                      boxShadow: `0 4px 12px ${alpha(getRoleColor(user?.rol || ''), 0.3)}`
                    }}>
                      <Star sx={{ fontSize: 30 }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ 
                        fontWeight: 600, 
                        color: theme.palette.text.primary,
                        mb: 0.5 
                      }}>
                        Rol actual: {getRoleLabel(user?.rol || '')}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: theme.palette.text.secondary,
                        fontSize: '0.95rem'
                      }}>
                        Tu rol determina los permisos y funcionalidades disponibles en el sistema
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>

            {/* Botón de Guardar mejorado */}
            <motion.div variants={itemVariants}>
              <Card sx={{
                background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                color: '#ffffff',
                borderRadius: 3,
                overflow: 'hidden',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 100%)',
                  pointerEvents: 'none'
                }
              }}>
                <CardContent sx={{ p: 4, position: 'relative' }}>
                  <Stack direction="row" alignItems="center" spacing={3}>
                    <Avatar sx={{
                      backgroundColor: alpha('#ffffff', 0.2),
                      width: 60,
                      height: 60,
                      backdropFilter: 'blur(10px)'
                    }}>
                      <Save sx={{ color: '#ffffff', fontSize: 30 }} />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h5" sx={{ 
                        color: '#ffffff', 
                        fontWeight: 700,
                        mb: 0.5
                      }}>
                        Guardar Cambios
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        color: alpha('#ffffff', 0.9),
                        fontSize: '1rem'
                      }}>
                        Actualiza tu información personal de forma segura
                      </Typography>
                    </Box>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                      sx={{
                        backgroundColor: '#ffffff',
                        color: theme.palette.success.main,
                        fontWeight: 700,
                        px: 4,
                        py: 2,
                        borderRadius: 2,
                        fontSize: '1.1rem',
                        boxShadow: `0 4px 12px ${alpha('#000000', 0.2)}`,
                        '&:hover': {
                          backgroundColor: alpha('#ffffff', 0.9),
                          transform: 'translateY(-2px)',
                          boxShadow: `0 8px 20px ${alpha('#000000', 0.3)}`
                        },
                        '&:disabled': {
                          backgroundColor: alpha('#ffffff', 0.5),
                          color: alpha(theme.palette.success.main, 0.5)
                        }
                      }}
                    >
                      {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Stack>
        </form>
      </Container>
    </motion.div>
  );
};

export default UserProfile;
