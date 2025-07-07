import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  useTheme,
  alpha,
  Chip,
  Stack,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  Dashboard,
  Event,
  AdminPanelSettings,
  ContentCut,
  Person,
  Logout,
  Settings,
  Notifications,
  CalendarMonth,
  Groups,
  Analytics,
  Schedule,
  CheckCircle
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

interface NavigationItem {
  label: string;
  path: string;
  icon: React.ReactElement;
  roles: ('cliente' | 'admin' | 'peluquero')[];
  badge?: number;
}

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigationItems: NavigationItem[] = [
    {
      label: 'Inicio',
      path: '/',
      icon: <Home />,
      roles: ['cliente', 'admin', 'peluquero']
    },
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: <Dashboard />,
      roles: ['cliente', 'admin', 'peluquero']
    },
    {
      label: 'Reservar Cita',
      path: '/dashboard?section=newAppointment',
      icon: <Event />,
      roles: ['cliente']
    },
    {
      label: 'Mis Citas',
      path: '/dashboard?section=myAppointments',
      icon: <CalendarMonth />,
      roles: ['cliente']
    },
    {
      label: 'Panel Peluquero',
      path: '/hairdresser',
      icon: <ContentCut />,
      roles: ['peluquero']
    },
    {
      label: 'Agenda',
      path: '/hairdresser?section=schedule',
      icon: <Schedule />,
      roles: ['peluquero']
    },
    {
      label: 'Citas Pendientes',
      path: '/hairdresser?section=pending',
      icon: <CheckCircle />,
      roles: ['peluquero'],
      badge: 3 // Esto vendría de un estado real
    },
    {
      label: 'Panel Admin',
      path: '/admin',
      icon: <AdminPanelSettings />,
      roles: ['admin']
    },
    {
      label: 'Usuarios',
      path: '/admin?section=users',
      icon: <Groups />,
      roles: ['admin']
    },
    {
      label: 'Reportes',
      path: '/admin?section=reports',
      icon: <Analytics />,
      roles: ['admin']
    }
  ];

  const filteredItems = navigationItems.filter(item => 
    user && item.roles.includes(user.rol)
  );

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    handleMenuClose();
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

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path.split('?')[0]);
  };

  const mobileDrawer = (
    <Box sx={{ width: 280 }}>
      <Box sx={{ 
        p: 3, 
        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        color: 'white'
      }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ 
            width: 48, 
            height: 48,
            background: 'rgba(255,255,255,0.2)'
          }}>
            {user?.nombre.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {user?.nombre}
            </Typography>
            <Chip 
              label={getRoleLabel(user?.rol || '')}
              size="small"
              sx={{ 
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 500
              }}
            />
          </Box>
        </Stack>
      </Box>

      <List sx={{ px: 1, py: 2 }}>
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                mx: 1,
                background: isActive(item.path) 
                  ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.secondary.main, 0.2)})`
                  : 'transparent',
                border: isActive(item.path) 
                  ? `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
                  : '1px solid transparent',
                '&:hover': {
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
                  transform: 'translateX(4px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              <ListItemIcon sx={{ 
                color: isActive(item.path) ? theme.palette.primary.main : 'inherit',
                minWidth: 40
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: isActive(item.path) ? 600 : 400,
                    color: isActive(item.path) ? theme.palette.primary.main : 'inherit'
                  }
                }}
              />
              {item.badge && (
                <Chip 
                  label={item.badge}
                  size="small"
                  color="error"
                  sx={{ ml: 1, minWidth: 20, height: 20 }}
                />
              )}
            </ListItemButton>
          </motion.div>
        ))}
      </List>

      <Divider sx={{ mx: 2 }} />
      
      <List sx={{ px: 1, py: 1 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            mx: 1,
            color: theme.palette.error.main,
            '&:hover': {
              background: alpha(theme.palette.error.main, 0.1)
            }
          }}
        >
          <ListItemIcon sx={{ color: theme.palette.error.main, minWidth: 40 }}>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Cerrar Sesión" />
        </ListItemButton>
      </List>
    </Box>
  );

  if (!user) {
    return (
      <AppBar 
        position="sticky" 
        sx={{ 
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.background.paper, 0.95)})`,
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
        }}
      >
        <Toolbar>
          <Typography 
            variant="h6" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            💇‍♀️ PeluMous
          </Typography>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/auth')}
            sx={{ 
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 600
            }}
          >
            Iniciar Sesión
          </Button>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <>
      <AppBar 
        position="sticky" 
        sx={{ 
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.background.paper, 0.98)})`,
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
          boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleMobileMenuToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography 
            variant="h6" 
            sx={{ 
              flexGrow: isMobile ? 1 : 0,
              mr: isMobile ? 0 : 4,
              fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            💇‍♀️ PeluMous
          </Typography>

          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
              {filteredItems.map((item) => (
                <motion.div
                  key={item.path}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    startIcon={item.icon}
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      borderRadius: 3,
                      textTransform: 'none',
                      fontWeight: 500,
                      px: 2,
                      py: 1,
                      position: 'relative',
                      background: isActive(item.path)
                        ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.2)}, ${alpha(theme.palette.secondary.main, 0.2)})`
                        : 'transparent',
                      color: isActive(item.path) ? theme.palette.primary.main : 'inherit',
                      border: isActive(item.path) 
                        ? `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
                        : '1px solid transparent',
                      '&:hover': {
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
                      }
                    }}
                  >
                    {item.label}
                    {item.badge && (
                      <Chip 
                        label={item.badge}
                        size="small"
                        color="error"
                        sx={{ 
                          ml: 1, 
                          minWidth: 20, 
                          height: 20,
                          position: 'absolute',
                          top: -8,
                          right: -8
                        }}
                      />
                    )}
                  </Button>
                </motion.div>
              ))}
            </Box>
          )}

          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton>
              <Notifications />
            </IconButton>
            
            <Button
              onClick={handleMenuOpen}
              sx={{ 
                borderRadius: 3,
                textTransform: 'none',
                p: 1,
                minWidth: 'auto'
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar sx={{ 
                  width: 32, 
                  height: 32,
                  background: `linear-gradient(135deg, ${getRoleColor(user.rol)}, ${alpha(getRoleColor(user.rol), 0.7)})`
                }}>
                  {user.nombre.charAt(0)}
                </Avatar>
                {!isMobile && (
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {user.nombre}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {getRoleLabel(user.rol)}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            mt: 1,
            minWidth: 200,
            background: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
          }
        }}
      >
        <MenuItem onClick={() => navigate('/dashboard')} sx={{ borderRadius: 2, mx: 1 }}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Mi Perfil
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ borderRadius: 2, mx: 1 }}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Configuración
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem 
          onClick={handleLogout} 
          sx={{ 
            borderRadius: 2, 
            mx: 1, 
            color: theme.palette.error.main 
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: theme.palette.error.main }} />
          </ListItemIcon>
          Cerrar Sesión
        </MenuItem>
      </Menu>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleMobileMenuToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            background: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(10px)'
          },
        }}
      >
        {mobileDrawer}
      </Drawer>
    </>
  );
};

export default Navigation;
