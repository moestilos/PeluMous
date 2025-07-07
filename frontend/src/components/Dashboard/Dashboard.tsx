import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Stack,
  Avatar,
  Chip,
  useTheme,
  alpha,
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  EventNote,
  ContentCut,
  People,
  ExitToApp,
  Dashboard as DashboardIcon,
  Add as AddIcon,
  Schedule,
  Star,
  TrendingUp,
  Spa,
  AccountCircle
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import NewAppointment from '../Appointments/NewAppointment';
import MyAppointments from '../Appointments/MyAppointments';
import HairdresserPanel from '../Hairdresser/HairdresserPanel';

const Dashboard: React.FC = () => {
  const [activeView, setActiveView] = useState('overview');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const menuItems = [
    { id: 'overview', label: 'Resumen', icon: <DashboardIcon />, badge: null },
    { id: 'appointments', label: 'Mis Citas', icon: <EventNote />, badge: '3' },
    { id: 'new-appointment', label: 'Nueva Cita', icon: <AddIcon />, badge: null },
    { id: 'services', label: 'Servicios', icon: <ContentCut />, badge: null },
  ];

  if (user?.rol === 'admin') {
    menuItems.push({ id: 'users', label: 'Usuarios', icon: <People />, badge: null });
  }

  if (user?.rol === 'peluquero') {
    menuItems.push({ id: 'hairdresser-panel', label: 'Panel Peluquero', icon: <Spa />, badge: null });
  }

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

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Box sx={{ 
                mb: 4,
                p: 4,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Elementos decorativos */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: -30,
                    right: -30,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, transparent)`,
                    filter: 'blur(30px)'
                  }}
                />
                
                <Stack direction="row" alignItems="center" spacing={3} sx={{ position: 'relative', zIndex: 1 }}>
                  <Avatar sx={{ 
                    width: 80, 
                    height: 80,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    fontSize: '2rem',
                    fontWeight: 700
                  }}>
                    {user?.nombre?.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 700,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 1
                      }}
                    >
                      ¡Bienvenido, {user?.nombre}!
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                      Es genial tenerte de vuelta
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Chip 
                        icon={<AccountCircle />} 
                        label={user?.rol ? user.rol.charAt(0).toUpperCase() + user.rol.slice(1) : 'Usuario'} 
                        color="primary" 
                        variant="filled"
                        sx={{ fontWeight: 600 }}
                      />
                      <Chip 
                        icon={<Star />} 
                        label="Usuario Activo" 
                        color="success" 
                        variant="outlined"
                      />
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mt: 3 }}>
                <Card sx={{ 
                  flex: 1,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                      <Avatar sx={{ 
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                        width: 48,
                        height: 48
                      }}>
                        <Schedule />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Próximas Citas
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                      Revisa y gestiona tus próximas citas programadas con nuestros profesionales
                    </Typography>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      startIcon={<EventNote />}
                      onClick={() => setActiveView('appointments')}
                      sx={{ 
                        fontWeight: 600,
                        borderWidth: 2,
                        '&:hover': {
                          borderWidth: 2,
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      Ver Mis Citas
                    </Button>
                  </CardContent>
                </Card>
                
                <Card sx={{ 
                  flex: 1,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  color: 'white',
                  border: 'none',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.4)}`
                  }
                }}>
                  <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                      <Avatar sx={{ 
                        background: 'rgba(255,255,255,0.2)',
                        width: 48,
                        height: 48
                      }}>
                        <AddIcon sx={{ color: 'white' }} />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Reservar Cita
                      </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', mb: 3, lineHeight: 1.6 }}>
                      Programa una nueva cita con nuestros profesionales especializados
                    </Typography>
                    <Button 
                      variant="contained" 
                      fullWidth
                      startIcon={<AddIcon />}
                      onClick={() => setActiveView('new-appointment')}
                      sx={{
                        background: 'white',
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                        '&:hover': {
                          background: 'rgba(255,255,255,0.9)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
                        }
                      }}
                    >
                      Nueva Cita
                    </Button>
                  </CardContent>
                  {/* Elemento decorativo */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: -20,
                      right: -20,
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.1)',
                      filter: 'blur(20px)'
                    }}
                  />
                </Card>
              </Stack>
            </motion.div>

            {/* Sección de estadísticas rápidas */}
            <motion.div variants={itemVariants}>
              <Typography 
                variant="h5" 
                sx={{ 
                  mt: 4, 
                  mb: 3, 
                  fontWeight: 600,
                  textAlign: 'center',
                  color: 'text.primary'
                }}
              >
                Resumen Rápido
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Card sx={{ 
                  flex: 1, 
                  textAlign: 'center',
                  background: alpha(theme.palette.success.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`
                }}>
                  <CardContent>
                    <TrendingUp sx={{ fontSize: 40, color: theme.palette.success.main, mb: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      5
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Citas Completadas
                    </Typography>
                  </CardContent>
                </Card>
                <Card sx={{ 
                  flex: 1, 
                  textAlign: 'center',
                  background: alpha(theme.palette.warning.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`
                }}>
                  <CardContent>
                    <Schedule sx={{ fontSize: 40, color: theme.palette.warning.main, mb: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      2
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Citas Pendientes
                    </Typography>
                  </CardContent>
                </Card>
                <Card sx={{ 
                  flex: 1, 
                  textAlign: 'center',
                  background: alpha(theme.palette.info.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`
                }}>
                  <CardContent>
                    <Star sx={{ fontSize: 40, color: theme.palette.info.main, mb: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      4.8
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Calificación Promedio
                    </Typography>
                  </CardContent>
                </Card>
              </Stack>
            </motion.div>
          </motion.div>
        );
      case 'appointments':
        return <MyAppointments />;
      case 'new-appointment':
        return <NewAppointment />;
      case 'hairdresser-panel':
        return <HairdresserPanel />;
      case 'services':
        return (
          <Typography variant="h4">
            Lista de Servicios - En desarrollo
          </Typography>
        );
      default:
        return <div>Vista no encontrada</div>;
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar 
        position="static"
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          backdropFilter: 'blur(10px)',
          boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.15)}`
        }}
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
            sx={{
              mr: 2,
              background: 'rgba(255,255,255,0.1)',
              '&:hover': {
                background: 'rgba(255,255,255,0.2)',
                transform: 'scale(1.05)'
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <Stack direction="row" alignItems="center" spacing={1} sx={{ flexGrow: 1 }}>
            <Avatar sx={{ 
              background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
              width: 32, 
              height: 32 
            }}>
              <Spa fontSize="small" />
            </Avatar>
            <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
              Bella Vista
            </Typography>
          </Stack>
          
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar sx={{ 
              width: 32, 
              height: 32, 
              background: 'rgba(255,255,255,0.2)',
              fontSize: '0.875rem',
              fontWeight: 600
            }}>
              {user?.nombre?.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
                {user?.nombre}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                {user?.rol ? user.rol.charAt(0).toUpperCase() + user.rol.slice(1) : 'Usuario'}
              </Typography>
            </Box>
            {user?.rol === 'admin' && (
              <Button 
                color="inherit" 
                onClick={() => navigate('/admin')}
                sx={{
                  mr: 1,
                  background: 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                Panel Admin
              </Button>
            )}
            <IconButton
              color="inherit"
              onClick={handleLogout}
              sx={{
                background: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  background: 'rgba(255,255,255,0.2)',
                  transform: 'scale(1.05)'
                }
              }}
            >
              <ExitToApp />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            width: 280,
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.98)} 100%)`,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
            <Avatar sx={{ 
              width: 48, 
              height: 48,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              fontSize: '1.2rem',
              fontWeight: 700
            }}>
              {user?.nombre?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {user?.nombre}
              </Typography>
              <Chip 
                label={user?.rol ? user.rol.charAt(0).toUpperCase() + user.rol.slice(1) : 'Usuario'} 
                size="small" 
                color="primary"
                sx={{ fontWeight: 500 }}
              />
            </Box>
          </Stack>
          
          <Divider sx={{ mb: 2, opacity: 0.3 }} />
          
          <List sx={{ px: 0 }}>
            {menuItems.map((item) => (
              <ListItemButton 
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setDrawerOpen(false);
                }}
                selected={activeView === item.id}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  '&.Mui-selected': {
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`
                    }
                  },
                  '&:hover': {
                    background: alpha(theme.palette.primary.main, 0.05),
                    transform: 'translateX(4px)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <ListItemIcon sx={{ 
                  color: activeView === item.id ? theme.palette.primary.main : 'inherit',
                  minWidth: 40
                }}>
                  {item.badge ? (
                    <Badge badgeContent={item.badge} color="error" variant="dot">
                      {item.icon}
                    </Badge>
                  ) : (
                    item.icon
                  )}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label} 
                  primaryTypographyProps={{
                    fontWeight: activeView === item.id ? 600 : 500,
                    color: activeView === item.id ? theme.palette.primary.main : 'inherit'
                  }}
                />
              </ListItemButton>
            ))}
          </List>
          
          <Divider sx={{ my: 2, opacity: 0.3 }} />
          
          <ListItemButton 
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              background: alpha(theme.palette.error.main, 0.1),
              border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
              '&:hover': {
                background: alpha(theme.palette.error.main, 0.15),
                transform: 'translateX(4px)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            <ListItemIcon sx={{ color: theme.palette.error.main, minWidth: 40 }}>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText 
              primary="Cerrar Sesión" 
              primaryTypographyProps={{
                fontWeight: 500,
                color: theme.palette.error.main
              }}
            />
          </ListItemButton>
        </Box>
      </Drawer>

      <Container sx={{ mt: 4, mb: 4 }}>
        {renderContent()}
      </Container>
    </Box>
  );
};

export default Dashboard;
