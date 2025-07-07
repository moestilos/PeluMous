import React from 'react';
import { motion } from 'framer-motion';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Stack,
  Chip,
  Alert,
  Avatar,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Login as LoginIcon,
  ContentCut as ServiceIcon,
  Schedule as AppointmentIcon,
  Star as StarIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  Brush as BrushIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const WelcomePanel: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLoginRedirect = () => {
    navigate('/auth');
  };

  const handleDashboardRedirect = () => {
    navigate('/dashboard');
  };

  const handleHairdresserRedirect = () => {
    navigate('/hairdresser');
  };

  const handleAdminRedirect = () => {
    navigate('/admin');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box sx={{ mb: 6 }}>
        <Stack spacing={4}>
          {/* Panel de bienvenida principal */}
          <motion.div variants={itemVariants}>
            <Card sx={{ 
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <CardContent sx={{ p: 6, textAlign: 'center' }}>
                <Avatar sx={{ 
                  width: 80, 
                  height: 80, 
                  mx: 'auto', 
                  mb: 3,
                  background: 'rgba(255,255,255,0.2)',
                  fontSize: '2.5rem'
                }}>
                  ✂️
                </Avatar>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
                  Bienvenido a Moestilos
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
                  Tu centro de belleza profesional
                </Typography>
                {user ? (
                  <Alert 
                    severity="success" 
                    sx={{ 
                      backgroundColor: '#ffffff !important',
                      color: '#000000 !important',
                      border: '2px solid #000000 !important',
                      borderRadius: '8px !important',
                      boxShadow: '4px 4px 0px #000000 !important',
                      '& .MuiAlert-icon': { 
                        color: '#000000 !important' 
                      }
                    }}
                  >
                    ¡Bienvenido de vuelta, {user.nombre}! Que tengas un excelente día.
                  </Alert>
                ) : (
                  <Typography variant="h6" sx={{ opacity: 0.8 }}>
                    Descubre nuestros servicios profesionales de belleza
                  </Typography>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Panel de acceso para usuarios no autenticados */}
          {!user && (
            <motion.div variants={itemVariants}>
              <Card sx={{ 
                border: `2px solid ${theme.palette.primary.main}`,
                background: alpha(theme.palette.primary.main, 0.05)
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center" justifyContent="space-between">
                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                        <Avatar sx={{ background: theme.palette.primary.main }}>
                          <LoginIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            Acceso al Sistema
                          </Typography>
                          <Chip label="Iniciar Sesión" color="primary" size="small" sx={{ mt: 0.5 }} />
                        </Box>
                      </Stack>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        Inicia sesión para acceder a tus citas, servicios y mucho más
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        <Chip icon={<AppointmentIcon />} label="Reservar Citas" variant="outlined" size="small" />
                        <Chip icon={<ServiceIcon />} label="Ver Servicios" variant="outlined" size="small" />
                        <Chip icon={<StarIcon />} label="Seguimiento" variant="outlined" size="small" />
                      </Stack>
                    </Box>
                    <Button 
                      variant="contained" 
                      color="primary"
                      size="large"
                      onClick={handleLoginRedirect}
                      startIcon={<LoginIcon />}
                      sx={{ fontWeight: 600, px: 4, py: 1.5 }}
                    >
                      Iniciar Sesión
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Panel de acceso rápido para usuarios autenticados */}
          {user && (
            <motion.div variants={itemVariants}>
              <Card sx={{ 
                border: `2px solid ${theme.palette.primary.main}`,
                background: alpha(theme.palette.primary.main, 0.05),
                position: 'relative'
              }}>
                <CardContent sx={{ p: 4 }}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center" justifyContent="space-between">
                    <Box sx={{ flex: 1 }}>
                      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                        <Avatar sx={{ 
                          background: theme.palette.primary.main,
                          width: 48,
                          height: 48 
                        }}>
                          {user.rol === 'admin' ? <AdminIcon /> : 
                           user.rol === 'peluquero' ? <BrushIcon /> : <PersonIcon />}
                        </Avatar>
                        <Box>
                          <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            Mi Panel de Control
                          </Typography>
                          <Chip 
                            label={user.rol === 'admin' ? 'Administrador' : 
                                  user.rol === 'peluquero' ? 'Peluquero' : 'Cliente'} 
                            color="primary" 
                            size="small" 
                            sx={{ mt: 0.5 }} 
                          />
                        </Box>
                      </Stack>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        Accede a todas tus herramientas y funcionalidades personalizadas
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        <Chip icon={<AppointmentIcon />} label="Dashboard" variant="outlined" size="small" />
                        {user.rol === 'cliente' && (
                          <>
                            <Chip icon={<ServiceIcon />} label="Mis Citas" variant="outlined" size="small" />
                            <Chip icon={<StarIcon />} label="Servicios" variant="outlined" size="small" />
                          </>
                        )}
                        {user.rol === 'peluquero' && (
                          <Chip icon={<BrushIcon />} label="Gestión Profesional" variant="outlined" size="small" />
                        )}
                        {user.rol === 'admin' && (
                          <Chip icon={<AdminIcon />} label="Control Total" variant="outlined" size="small" />
                        )}
                      </Stack>
                    </Box>
                    
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <Button 
                        variant="contained" 
                        color="primary"
                        size="large"
                        onClick={handleDashboardRedirect}
                        sx={{ fontWeight: 600, px: 3, py: 1.5 }}
                      >
                        Dashboard
                      </Button>
                      
                      {user.rol === 'admin' && (
                        <Button 
                          variant="outlined" 
                          color="error"
                          size="large"
                          onClick={handleAdminRedirect}
                          startIcon={<AdminIcon />}
                          sx={{ fontWeight: 600, px: 3, py: 1.5 }}
                        >
                          Panel Admin
                        </Button>
                      )}
                      
                      {user.rol === 'peluquero' && (
                        <Button 
                          variant="outlined" 
                          color="secondary"
                          size="large"
                          onClick={handleHairdresserRedirect}
                          startIcon={<BrushIcon />}
                          sx={{ fontWeight: 600, px: 3, py: 1.5 }}
                        >
                          Panel Peluquero
                        </Button>
                      )}
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </Stack>
      </Box>
    </motion.div>
  );
};

export default WelcomePanel;
