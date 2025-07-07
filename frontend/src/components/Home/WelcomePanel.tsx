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
  Divider,
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
  Brush as BrushIcon,
  Spa as SpaIcon
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
        maxWidth: 900, 
        mx: 'auto',
        minHeight: '70vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        borderRadius: 3,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative background elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
            filter: 'blur(40px)',
            zIndex: 0
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.1)})`,
            filter: 'blur(30px)',
            zIndex: 0
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div variants={itemVariants}>
            <Stack alignItems="center" spacing={2} sx={{ mb: 4 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  mb: 2
                }}
              >
                <SpaIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  textAlign: 'center',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}
              >
                Bienvenido a Bella Vista
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ textAlign: 'center', fontWeight: 400 }}
              >
                Tu centro de belleza profesional
              </Typography>
            </Stack>
          </motion.div>

          <motion.div variants={itemVariants}>
            {!user ? (
              <Alert 
                severity="info" 
                sx={{ 
                  mb: 4,
                  background: alpha(theme.palette.info.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    color: theme.palette.info.main
                  }
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Inicia sesión para acceder a todas las funcionalidades exclusivas
                </Typography>
              </Alert>
            ) : (
              <Alert 
                severity="success" 
                sx={{ 
                  mb: 4,
                  background: alpha(theme.palette.success.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    color: theme.palette.success.main
                  }
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  ¡Bienvenido de vuelta, {user.nombre}! Que tengas un excelente día.
                </Typography>
              </Alert>
            )}
          </motion.div>

          <Stack spacing={3}>
            {/* Para usuarios no autenticados */}
            {!user && (
              <motion.div variants={itemVariants}>
                <Card sx={{ 
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  border: 'none',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <CardContent sx={{ p: 4 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center" justifyContent="space-between">
                      <Box sx={{ flex: 1 }}>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                          <Avatar sx={{ background: 'rgba(255,255,255,0.2)' }}>
                            <LoginIcon sx={{ color: 'white' }} />
                          </Avatar>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                            Accede a tu cuenta
                          </Typography>
                        </Stack>
                        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                          Inicia sesión para reservar citas, gestionar tu perfil y disfrutar de una experiencia personalizada
                        </Typography>
                        <Stack direction="row" spacing={1}>
                          <Chip 
                            icon={<AppointmentIcon />} 
                            label="Reservas online" 
                            sx={{ 
                              background: 'rgba(255,255,255,0.2)', 
                              color: 'white',
                              '& .MuiChip-icon': { color: 'white' }
                            }} 
                            size="small" 
                          />
                          <Chip 
                            icon={<ServiceIcon />} 
                            label="Servicios exclusivos" 
                            sx={{ 
                              background: 'rgba(255,255,255,0.2)', 
                              color: 'white',
                              '& .MuiChip-icon': { color: 'white' }
                            }} 
                            size="small" 
                          />
                        </Stack>
                      </Box>
                      <Button 
                        variant="contained" 
                        size="large"
                        startIcon={<LoginIcon />}
                        onClick={handleLoginRedirect}
                        sx={{
                          background: 'white',
                          color: theme.palette.primary.main,
                          fontWeight: 600,
                          px: 4,
                          py: 1.5,
                          '&:hover': {
                            background: 'rgba(255,255,255,0.9)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                          }
                        }}
                      >
                        Iniciar Sesión
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Para clientes autenticados */}
            {user && user.rol === 'cliente' && (
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
                          <Avatar sx={{ background: theme.palette.primary.main }}>
                            <PersonIcon />
                          </Avatar>
                          <Box>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                              Dashboard Cliente
                            </Typography>
                            <Chip label="Cliente" color="primary" size="small" sx={{ mt: 0.5 }} />
                          </Box>
                        </Stack>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                          Gestiona tus citas, explora servicios y mantén tu perfil actualizado
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          <Chip icon={<AppointmentIcon />} label="Mis Citas" variant="outlined" size="small" />
                          <Chip icon={<ServiceIcon />} label="Servicios" variant="outlined" size="small" />
                          <Chip icon={<StarIcon />} label="Historial" variant="outlined" size="small" />
                        </Stack>
                      </Box>
                      <Button 
                        variant="contained" 
                        color="primary"
                        size="large"
                        onClick={handleDashboardRedirect}
                        sx={{ fontWeight: 600, px: 4, py: 1.5 }}
                      >
                        Ir al Dashboard
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Para peluqueros autenticados */}
            {user && user.rol === 'peluquero' && (
              <>
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
                              <PersonIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                Dashboard Personal
                              </Typography>
                              <Chip label="Cliente" color="primary" size="small" sx={{ mt: 0.5 }} />
                            </Box>
                          </Stack>
                          <Typography variant="body1" color="text.secondary">
                            Reserva citas personales y gestiona tu perfil
                          </Typography>
                        </Box>
                        <Button 
                          variant="contained" 
                          color="primary"
                          size="large"
                          onClick={handleDashboardRedirect}
                          sx={{ fontWeight: 600, px: 4, py: 1.5 }}
                        >
                          Dashboard
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card sx={{ 
                    background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                    border: 'none',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <CardContent sx={{ p: 4 }}>
                      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center" justifyContent="space-between">
                        <Box sx={{ flex: 1 }}>
                          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                            <Avatar sx={{ background: 'rgba(255,255,255,0.2)' }}>
                              <BrushIcon sx={{ color: 'white' }} />
                            </Avatar>
                            <Box>
                              <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                                Panel Profesional
                              </Typography>
                              <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                                <Chip 
                                  label="Peluquero" 
                                  size="small" 
                                  sx={{ 
                                    background: 'rgba(255,255,255,0.9)', 
                                    color: theme.palette.secondary.main,
                                    fontWeight: 600 
                                  }} 
                                />
                                <Chip 
                                  icon={<StarIcon />} 
                                  label="Profesional" 
                                  size="small"
                                  sx={{ 
                                    background: 'rgba(255,255,255,0.2)', 
                                    color: 'white',
                                    '& .MuiChip-icon': { color: 'white' }
                                  }} 
                                />
                              </Stack>
                            </Box>
                          </Stack>
                          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                            Gestiona tu agenda, actualiza estados de citas y proporciona el mejor servicio
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            <Chip 
                              label="Agenda" 
                              variant="outlined" 
                              size="small" 
                              sx={{ 
                                color: 'white', 
                                borderColor: 'rgba(255,255,255,0.5)',
                                '&:hover': { borderColor: 'white' }
                              }} 
                            />
                            <Chip 
                              label="Gestión de Citas" 
                              variant="outlined" 
                              size="small" 
                              sx={{ 
                                color: 'white', 
                                borderColor: 'rgba(255,255,255,0.5)',
                                '&:hover': { borderColor: 'white' }
                              }} 
                            />
                          </Stack>
                        </Box>
                        <Button 
                          variant="contained" 
                          size="large"
                          onClick={handleHairdresserRedirect}
                          sx={{
                            background: 'white',
                            color: theme.palette.secondary.main,
                            fontWeight: 600,
                            px: 4,
                            py: 1.5,
                            '&:hover': {
                              background: 'rgba(255,255,255,0.9)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                            }
                          }}
                        >
                          Panel Peluquero
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            )}

            {/* Para administradores */}
            {user && user.rol === 'admin' && (
              <>
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
                              <PersonIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                Dashboard Personal
                              </Typography>
                              <Chip label="Cliente" color="primary" size="small" sx={{ mt: 0.5 }} />
                            </Box>
                          </Stack>
                          <Typography variant="body1" color="text.secondary">
                            Reserva citas personales y gestiona tu perfil
                          </Typography>
                        </Box>
                        <Button 
                          variant="contained" 
                          color="primary"
                          size="large"
                          onClick={handleDashboardRedirect}
                          sx={{ fontWeight: 600, px: 4, py: 1.5 }}
                        >
                          Dashboard
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card sx={{ 
                    background: `linear-gradient(135deg, ${theme.palette.error.main} 0%, #d32f2f 100%)`,
                    border: 'none',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <CardContent sx={{ p: 4 }}>
                      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center" justifyContent="space-between">
                        <Box sx={{ flex: 1 }}>
                          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                            <Avatar sx={{ background: 'rgba(255,255,255,0.2)' }}>
                              <AdminIcon sx={{ color: 'white' }} />
                            </Avatar>
                            <Box>
                              <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                                Panel Administrador
                              </Typography>
                              <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                                <Chip 
                                  label="Admin" 
                                  size="small" 
                                  sx={{ 
                                    background: 'rgba(255,255,255,0.9)', 
                                    color: theme.palette.error.main,
                                    fontWeight: 600 
                                  }} 
                                />
                                <Chip 
                                  icon={<StarIcon />} 
                                  label="Gestor" 
                                  size="small"
                                  sx={{ 
                                    background: 'rgba(255,255,255,0.2)', 
                                    color: 'white',
                                    '& .MuiChip-icon': { color: 'white' }
                                  }} 
                                />
                              </Stack>
                            </Box>
                          </Stack>
                          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
                            Control total del sistema: usuarios, peluqueros, servicios y configuración
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            <Chip 
                              label="Usuarios" 
                              variant="outlined" 
                              size="small" 
                              sx={{ 
                                color: 'white', 
                                borderColor: 'rgba(255,255,255,0.5)',
                                '&:hover': { borderColor: 'white' }
                              }} 
                            />
                            <Chip 
                              label="Peluqueros" 
                              variant="outlined" 
                              size="small" 
                              sx={{ 
                                color: 'white', 
                                borderColor: 'rgba(255,255,255,0.5)',
                                '&:hover': { borderColor: 'white' }
                              }} 
                            />
                            <Chip 
                              label="Servicios" 
                              variant="outlined" 
                              size="small" 
                              sx={{ 
                                color: 'white', 
                                borderColor: 'rgba(255,255,255,0.5)',
                                '&:hover': { borderColor: 'white' }
                              }} 
                            />
                          </Stack>
                        </Box>
                        <Button 
                          variant="contained" 
                          size="large"
                          onClick={handleAdminRedirect}
                          sx={{
                            background: 'white',
                            color: theme.palette.error.main,
                            fontWeight: 600,
                            px: 4,
                            py: 1.5,
                            '&:hover': {
                              background: 'rgba(255,255,255,0.9)',
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                            }
                          }}
                        >
                          Panel Admin
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            )}
          </Stack>

          {/* Información adicional con estilo mejorado */}
          <motion.div variants={itemVariants}>
            <Divider sx={{ my: 4, opacity: 0.3 }} />
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, opacity: 0.8 }}>
                Sistema de Gestión de Peluquería • Versión 2.0 • Diseño Profesional
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.6 }}>
                {user ? `👋 Conectado como: ${user.nombre} • ${user.email}` : '🔒 Sesión no iniciada'}
              </Typography>
            </Box>
          </motion.div>
        </Box>
      </Box>
    </motion.div>
  );
};

export default WelcomePanel;
