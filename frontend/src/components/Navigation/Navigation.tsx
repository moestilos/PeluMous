import React, { useState } from 'react';
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
  Notifications,
  CalendarMonth,
  Groups,
  Schedule,
  CheckCircle
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import {
  useNavigate,
  useLocation,
  NavLink
} from 'react-router-dom';

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
      roles: ['cliente'] // Solo clientes ven el Home
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

  const handleLogout = () => {
    logout();
    navigate('/');
    handleMenuClose();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return '#dc2626';
      case 'peluquero':
        return '#f59e0b';
      case 'cliente':
        return '#059669';
      default:
        return '#000000';
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
    const currentPath = location.pathname;
    const currentSearch = location.search;
    
    // Para la ruta raíz
    if (path === '/') {
      return currentPath === '/';
    }
    
    // Para rutas con query params específicos
    if (path.includes('?')) {
      const [pathPart, searchPart] = path.split('?');
      return currentPath === pathPart && currentSearch.includes(searchPart);
    }
    
    // Para rutas básicas
    return currentPath === path;
  };

  const mobileDrawer = (
    <Box sx={{ width: 280 }}>
      <Box sx={{ 
        p: 3, 
        background: 'linear-gradient(135deg, #000000, #333333)',
        color: 'white'
      }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ 
            width: 48, 
            height: 48,
            background: 'rgba(255,255,255,0.2)'
          }}
          src={user?.profileImage ? `http://localhost:5000${user.profileImage}` : undefined}
          >
            {!user?.profileImage && user?.nombre.charAt(0)}
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
        {filteredItems.map(item => (
          <ListItemButton
            component={NavLink}
            to={item.path}
            key={item.path}
            onClick={() => setMobileOpen(false)}
            selected={isActive(item.path)}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              mx: 1,
              background: isActive(item.path)
                ? 'rgba(0, 0, 0, 0.08)'
                : 'transparent',
              border: isActive(item.path)
                ? '1px solid rgba(0, 0, 0, 0.12)'
                : '1px solid transparent'
            }}
          >
            <ListItemIcon sx={{ color: isActive(item.path) ? '#000000' : 'inherit', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} sx={{ '& .MuiListItemText-primary': { fontWeight: isActive(item.path) ? 600 : 400, color: isActive(item.path) ? '#000000' : 'inherit' } }} />
            {item.badge && (
              <Chip 
                label={item.badge}
                size="small"
                color="error"
                sx={{ ml: 1, minWidth: 20, height: 20 }}
              />
            )}
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ mx: 2 }} />
      
      <List sx={{ px: 1, py: 1 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            mx: 1,
            color: '#dc2626'
          }}
        >
          <ListItemIcon sx={{ color: '#dc2626', minWidth: 40 }}>
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
        elevation={0}
        sx={{ 
          background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.95), rgba(233, 69, 96, 0.95))',
          backdropFilter: 'blur(20px)',
          border: 'none',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flexGrow: 1 }}>
            <Avatar sx={{ 
              width: 40, 
              height: 40,
              background: 'rgba(255,255,255,0.2)',
              fontSize: '1.5rem'
            }}>
              ✂️
            </Avatar>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 800,
                color: '#ffffff',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              Moestilos
            </Typography>
          </Stack>
          
          <Stack direction="row" spacing={2} alignItems="center">
            <Button 
              variant="outlined" 
              onClick={() => {
                const servicesSection = document.getElementById('services-section');
                if (servicesSection) {
                  servicesSection.scrollIntoView({ behavior: 'smooth' });
                } else {
                  // Si no existe la sección, navegar a la página principal
                  navigate('/');
                  setTimeout(() => {
                    const section = document.getElementById('services-section');
                    section?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }
              }}
              sx={{ 
                borderColor: '#ffffff',
                color: '#ffffff',
                fontWeight: 600,
                borderWidth: 2,
                '&:hover': {
                  borderColor: '#ffffff',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderWidth: 2
                }
              }}
            >
              Ver Servicios
            </Button>
            <Button 
              variant="contained" 
              onClick={() => navigate('/auth')}
              sx={{ 
                backgroundColor: '#ffffff',
                color: '#1a1a2e',
                fontWeight: 700,
                px: 3,
                py: 1.5,
                borderRadius: 2,
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)'
                }
              }}
            >
              Iniciar Sesión
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e5e5e5',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleMobileMenuToggle}
              sx={{ mr: 2, color: '#000000' }}
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
              color: '#000000',
              cursor: 'pointer'
            }}
            onClick={() => navigate(user ? '/dashboard' : '/')}
          >
            Moestilos
          </Typography>

          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
              {filteredItems.map(item => (
                <Box key={item.path} sx={{ position: 'relative', '&:not(:last-child)': { mr: 3 } }}>
                  <Button
                    component={NavLink}
                    to={item.path}
                    startIcon={item.icon}
                    onClick={() => setMobileOpen(false)}
                    sx={{ textTransform: 'none', fontWeight: isActive(item.path) ? 600 : 500, color: isActive(item.path) ? '#000' : '#666', background: 'transparent', px: 0, py: 2 }}
                  >{item.label}</Button>
                  {isActive(item.path) && (
                    <motion.div layoutId="activeTab" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, backgroundColor: '#000', borderRadius: '2px 2px 0 0' }} />
                  )}
                </Box>
              ))}
            </Box>
          )}

          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton sx={{ color: '#000000' }}>
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
                  background: getRoleColor(user.rol)
                }}
                src={user.profileImage ? `http://localhost:5000${user.profileImage}` : undefined}
                >
                  {!user.profileImage && user.nombre.charAt(0)}
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
            backgroundColor: '#ffffff',
            border: '1px solid #e5e5e5',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <MenuItem onClick={() => { navigate('/dashboard?section=profile'); handleMenuClose(); }} sx={{ borderRadius: 2, mx: 1 }}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Mi Perfil
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem 
          onClick={handleLogout} 
          sx={{ 
            borderRadius: 2, 
            mx: 1, 
            color: '#dc2626' 
          }}
        >
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: '#dc2626' }} />
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
            backgroundColor: '#ffffff'
          },
        }}
      >
        {mobileDrawer}
      </Drawer>
    </>
  );
};

export default Navigation;
