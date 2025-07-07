import React from 'react';
import { motion } from 'framer-motion';
import {
  Typography,
  Container,
  Card,
  CardContent,
  Box,
  Stack,
  Avatar,
  Chip,
  useTheme,
  alpha,
  Button
} from '@mui/material';
import {
  EventNote,
  ContentCut,
  Dashboard as DashboardIcon,
  Add as AddIcon,
  Schedule,
  Star,
  CalendarMonth,
  CheckCircle
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import NewAppointment from '../Appointments/NewAppointment';
import MyAppointments from '../Appointments/MyAppointments';

const Dashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  // Obtener la sección desde los parámetros de URL
  const section = searchParams.get('section') || 'overview';

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

  const renderOverview = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header de Bienvenida */}
        <motion.div variants={itemVariants}>
          <Card sx={{
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: 'white',
            mb: 4,
            overflow: 'hidden',
            position: 'relative'
          }}>
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" alignItems="center" spacing={3}>
                <Avatar sx={{
                  width: 80,
                  height: 80,
                  background: 'rgba(255,255,255,0.2)',
                  fontSize: '2rem'
                }}>
                  {user?.nombre.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                    ¡Hola, {user?.nombre}! 👋
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                    Bienvenido a tu panel de control
                  </Typography>
                  <Chip
                    label={user?.rol === 'cliente' ? 'Cliente' : user?.rol === 'admin' ? 'Administrador' : 'Peluquero'}
                    sx={{
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                </Box>
              </Stack>
              {/* Elemento decorativo */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  filter: 'blur(20px)'
                }}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Estadísticas Rápidas */}
        <motion.div variants={itemVariants}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 4 }}>
            <Card sx={{
              flex: 1,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.05)})`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.2)}`
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Avatar sx={{
                  width: 48,
                  height: 48,
                  background: theme.palette.primary.main,
                  mx: 'auto',
                  mb: 2
                }}>
                  <CalendarMonth />
                </Avatar>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                  5
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Citas este mes
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{
              flex: 1,
              background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
              border: `1px solid ${alpha(theme.palette.secondary.main, 0.2)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 8px 25px ${alpha(theme.palette.secondary.main, 0.2)}`
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Avatar sx={{
                  width: 48,
                  height: 48,
                  background: theme.palette.secondary.main,
                  mx: 'auto',
                  mb: 2
                }}>
                  <CheckCircle />
                </Avatar>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.secondary.main }}>
                  3
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Completadas
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{
              flex: 1,
              background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)}, ${alpha(theme.palette.warning.main, 0.05)})`,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 8px 25px ${alpha(theme.palette.warning.main, 0.2)}`
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Avatar sx={{
                  width: 48,
                  height: 48,
                  background: theme.palette.warning.main,
                  mx: 'auto',
                  mb: 2
                }}>
                  <Schedule />
                </Avatar>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>
                  2
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pendientes
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{
              flex: 1,
              background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)}, ${alpha(theme.palette.success.main, 0.05)})`,
              border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 8px 25px ${alpha(theme.palette.success.main, 0.2)}`
              }
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Avatar sx={{
                  width: 48,
                  height: 48,
                  background: theme.palette.success.main,
                  mx: 'auto',
                  mb: 2
                }}>
                  <Star />
                </Avatar>
                <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                  4.8
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Valoración
                </Typography>
              </CardContent>
            </Card>
          </Stack>
        </motion.div>

        {/* Acciones Rápidas */}
        <motion.div variants={itemVariants}>
          <Card sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.background.paper, 0.9)})`,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                🚀 Acciones Rápidas
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flexWrap: 'wrap' }}>
                {user?.rol === 'cliente' && (
                  <>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<AddIcon />}
                      onClick={() => navigate('/dashboard?section=newAppointment')}
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
                      Nueva Cita
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<EventNote />}
                      onClick={() => navigate('/dashboard?section=myAppointments')}
                      sx={{
                        py: 2,
                        px: 4,
                        '&:hover': {
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      Mis Citas
                    </Button>
                  </>
                )}
                
                {user?.rol === 'admin' && (
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<DashboardIcon />}
                    onClick={() => navigate('/admin')}
                    sx={{
                      py: 2,
                      px: 4,
                      background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 25px ${alpha(theme.palette.error.main, 0.3)}`
                      }
                    }}
                  >
                    Panel Admin
                  </Button>
                )}

                {user?.rol === 'peluquero' && (
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<ContentCut />}
                    onClick={() => navigate('/hairdresser')}
                    sx={{
                      py: 2,
                      px: 4,
                      background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 25px ${alpha(theme.palette.warning.main, 0.3)}`
                      }
                    }}
                  >
                    Panel Peluquero
                  </Button>
                )}
              </Stack>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </motion.div>
  );

  const renderContent = () => {
    switch (section) {
      case 'newAppointment':
        return <NewAppointment />;
      case 'myAppointments':
        return <MyAppointments />;
      case 'overview':
      default:
        return renderOverview();
    }
  };

  return (
    <Box>
      {renderContent()}
    </Box>
  );
};

export default Dashboard;
