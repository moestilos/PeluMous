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
  Button,
  LinearProgress,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  EventNote,
  ContentCut,
  Dashboard as DashboardIcon,
  Add as AddIcon,
  Schedule,
  Star,
  CalendarMonth,
  CheckCircle,
  TrendingUp,
  Person,
  Settings,
  Refresh,
  Analytics
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import NewAppointment from '../Appointments/NewAppointment';
import MyAppointments from '../Appointments/MyAppointments';
import UserProfile from '../Profile/UserProfile';

const Dashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();

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
        {/* Header de Bienvenida Mejorado */}
        <motion.div variants={itemVariants}>
          <Card sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            mb: 4,
            overflow: 'hidden',
            position: 'relative',
            borderRadius: 3
          }}>
            <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
              <Stack direction="row" alignItems="center" spacing={3}>
                <Avatar sx={{
                  width: 80,
                  height: 80,
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)'
                }}>
                  {user?.nombre.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 700, 
                    mb: 1,
                    color: 'white'
                  }}>
                    ¡Hola, {user?.nombre}! 👋
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)',
                    mb: 2,
                    fontSize: '1.1rem'
                  }}>
                    Bienvenido a tu panel de control
                  </Typography>
                  <Chip
                    label={user?.rol === 'cliente' ? '👤 Cliente' : user?.rol === 'admin' ? '👑 Administrador' : '✂️ Peluquero'}
                    sx={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}
                  />
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ 
                    fontWeight: 800, 
                    color: 'white',
                    mb: 1
                  }}>
                    {new Date().getDate()}
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: '0.9rem'
                  }}>
                    {new Date().toLocaleDateString('es-ES', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </Typography>
                </Box>
              </Stack>
              
              {/* Elemento decorativo */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -50,
                  right: -50,
                  width: 200,
                  height: 200,
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.1), transparent)',
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
                  background: 'radial-gradient(circle, rgba(255,255,255,0.05), transparent)',
                  zIndex: 0
                }}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Estadísticas Mejoradas */}
        <motion.div variants={itemVariants}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 4 }}>
            <Card className="hover-lift" sx={{
              flex: 1,
              background: 'linear-gradient(135deg, #667eea 10%, #764ba2 90%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3, position: 'relative', zIndex: 1 }}>
                <Avatar sx={{
                  width: 56,
                  height: 56,
                  background: 'rgba(255, 255, 255, 0.2)',
                  mx: 'auto',
                  mb: 2,
                  backdropFilter: 'blur(10px)'
                }}>
                  <CalendarMonth sx={{ fontSize: 28 }} />
                </Avatar>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                  5
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                  Citas este mes
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={75} 
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: 'rgba(255, 255, 255, 0.8)'
                      }
                    }}
                  />
                </Box>
              </CardContent>
              <Box sx={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                zIndex: 0
              }} />
            </Card>

            <Card className="hover-lift" sx={{
              flex: 1,
              background: 'linear-gradient(135deg, #f093fb 10%, #f5576c 90%)',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3, position: 'relative', zIndex: 1 }}>
                <Avatar sx={{
                  width: 56,
                  height: 56,
                  background: 'rgba(255, 255, 255, 0.2)',
                  mx: 'auto',
                  mb: 2,
                  backdropFilter: 'blur(10px)'
                }}>
                  <CheckCircle sx={{ fontSize: 28 }} />
                </Avatar>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                  3
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                  Completadas
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={60} 
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: 'rgba(255, 255, 255, 0.8)'
                      }
                    }}
                  />
                </Box>
              </CardContent>
              <Box sx={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                zIndex: 0
              }} />
            </Card>

            <Card className="hover-lift" sx={{
              flex: 1,
              background: 'linear-gradient(135deg, #ffecd2 10%, #fcb69f 90%)',
              color: '#8b4513',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3, position: 'relative', zIndex: 1 }}>
                <Avatar sx={{
                  width: 56,
                  height: 56,
                  background: 'rgba(139, 69, 19, 0.2)',
                  mx: 'auto',
                  mb: 2,
                  backdropFilter: 'blur(10px)',
                  color: '#8b4513'
                }}>
                  <Schedule sx={{ fontSize: 28 }} />
                </Avatar>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                  2
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                  Pendientes
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={40} 
                    sx={{
                      backgroundColor: 'rgba(139, 69, 19, 0.3)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: 'rgba(139, 69, 19, 0.8)'
                      }
                    }}
                  />
                </Box>
              </CardContent>
              <Box sx={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'rgba(139, 69, 19, 0.1)',
                zIndex: 0
              }} />
            </Card>

            <Card className="hover-lift" sx={{
              flex: 1,
              background: 'linear-gradient(135deg, #a8edea 10%, #fed6e3 90%)',
              color: '#2d3748',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <CardContent sx={{ textAlign: 'center', py: 3, position: 'relative', zIndex: 1 }}>
                <Avatar sx={{
                  width: 56,
                  height: 56,
                  background: 'rgba(45, 55, 72, 0.2)',
                  mx: 'auto',
                  mb: 2,
                  backdropFilter: 'blur(10px)',
                  color: '#2d3748'
                }}>
                  <Star sx={{ fontSize: 28 }} />
                </Avatar>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                  4.8
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                  Valoración
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={96} 
                    sx={{
                      backgroundColor: 'rgba(45, 55, 72, 0.3)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: 'rgba(45, 55, 72, 0.8)'
                      }
                    }}
                  />
                </Box>
              </CardContent>
              <Box sx={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'rgba(45, 55, 72, 0.1)',
                zIndex: 0
              }} />
            </Card>
          </Stack>
        </motion.div>

        {/* Acciones Rápidas Mejoradas */}
        <motion.div variants={itemVariants}>
          <Card className="glass-effect hover-lift">
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                    🚀 Acciones Rápidas
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Accede rápidamente a las funciones más importantes
                  </Typography>
                </Box>
                <Tooltip title="Actualizar datos">
                  <IconButton sx={{ 
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a67d8, #667eea)',
                    }
                  }}>
                    <Refresh />
                  </IconButton>
                </Tooltip>
              </Stack>
              
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
                        flex: { sm: 1 },
                        background: 'linear-gradient(135deg, #667eea, #764ba2)',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
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
                        flex: { sm: 1 },
                        '&:hover': {
                          transform: 'translateY(-4px)'
                        }
                      }}
                    >
                      Mis Citas
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<Person />}
                      onClick={() => navigate('/dashboard?section=profile')}
                      sx={{
                        py: 2,
                        px: 4,
                        flex: { sm: 1 },
                        '&:hover': {
                          transform: 'translateY(-4px)'
                        }
                      }}
                    >
                      Mi Perfil
                    </Button>
                  </>
                )}
                
                {user?.rol === 'admin' && (
                  <>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<DashboardIcon />}
                      onClick={() => navigate('/admin')}
                      sx={{
                        py: 2,
                        px: 4,
                        flex: { sm: 1 },
                        background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 40px rgba(240, 147, 251, 0.4)',
                        }
                      }}
                    >
                      Panel Admin
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<Analytics />}
                      sx={{
                        py: 2,
                        px: 4,
                        flex: { sm: 1 },
                        '&:hover': {
                          transform: 'translateY(-4px)'
                        }
                      }}
                    >
                      Estadísticas
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<Settings />}
                      sx={{
                        py: 2,
                        px: 4,
                        flex: { sm: 1 },
                        '&:hover': {
                          transform: 'translateY(-4px)'
                        }
                      }}
                    >
                      Configuración
                    </Button>
                  </>
                )}

                {user?.rol === 'peluquero' && (
                  <>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<ContentCut />}
                      onClick={() => navigate('/hairdresser')}
                      sx={{
                        py: 2,
                        px: 4,
                        flex: { sm: 1 },
                        background: 'linear-gradient(135deg, #ffecd2, #fcb69f)',
                        color: '#8b4513',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 40px rgba(255, 236, 210, 0.4)',
                        }
                      }}
                    >
                      Panel Peluquero
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<TrendingUp />}
                      sx={{
                        py: 2,
                        px: 4,
                        flex: { sm: 1 },
                        '&:hover': {
                          transform: 'translateY(-4px)'
                        }
                      }}
                    >
                      Mi Rendimiento
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<Schedule />}
                      sx={{
                        py: 2,
                        px: 4,
                        flex: { sm: 1 },
                        '&:hover': {
                          transform: 'translateY(-4px)'
                        }
                      }}
                    >
                      Mi Horario
                    </Button>
                  </>
                )}
              </Stack>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actividad Reciente */}
        <motion.div variants={itemVariants}>
          <Card className="glass-effect hover-lift" sx={{ mt: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                📈 Actividad Reciente
              </Typography>
              <Stack spacing={2}>
                <Paper sx={{ p: 2, background: 'rgba(102, 126, 234, 0.1)', borderRadius: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                      <CheckCircle />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Cita completada con éxito
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Hace 2 horas • Corte y peinado
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
                
                <Paper sx={{ p: 2, background: 'rgba(240, 147, 251, 0.1)', borderRadius: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)' }}>
                      <CalendarMonth />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Nueva cita programada
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Mañana a las 15:00 • Tinte y corte
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
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
      case 'profile':
        return <UserProfile />;
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
