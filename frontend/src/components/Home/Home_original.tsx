import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  useTheme,
  Stack,
  Avatar,
  Divider
} from '@mui/material';
import {
  ContentCut,
  Palette,
  Face,
  Spa,
  AccessTime,
  Star,
  Schedule,
  AutoAwesome
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import WelcomePanel from './WelcomePanel';
import axios from 'axios';

interface Service {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion: number;
  categoria: string;
}

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [services, setServices] = useState<Service[]>([]);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error cargando servicios:', error);
    }
  };

  const handleBookAppointment = (service: Service) => {
    if (!user) {
      setSelectedService(service);
      setShowLoginDialog(true);
    } else {
      navigate('/dashboard');
    }
  };

  const handleLogin = () => {
    setShowLoginDialog(false);
    navigate('/auth');
  };

  const getCategoryIcon = (categoria: string) => {
    switch (categoria) {
      case 'corte': return <ContentCut />;
      case 'tinte': return <Palette />;
      case 'peinado': return <Face />;
      case 'tratamiento': return <Spa />;
      default: return <ContentCut />;
    }
  };

  const getCategoryColor = (categoria: string) => {
    switch (categoria) {
      case 'corte': return 'primary';
      case 'tinte': return 'secondary';
      case 'peinado': return 'success';
      case 'tratamiento': return 'warning';
      case 'manicura': return 'info';
      default: return 'default';
    }
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
      <Box>
        <Container maxWidth="lg" sx={{ pt: 4 }}>
          {/* Panel de Bienvenida y Acceso Rápido */}
          <motion.div variants={itemVariants}>
            <WelcomePanel />
          </motion.div>
          
          {/* Hero Section Mejorado */}
          <motion.div variants={itemVariants}>
            <Box sx={{ 
              textAlign: 'center', 
              mb: 6,
              py: 8,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '24px',
              boxShadow: '0 20px 60px rgba(30, 41, 59, 0.15)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Elementos decorativos modernos */}
              <Box sx={{
                position: 'absolute',
                top: -100,
                left: -100,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(102, 126, 234, 0.1), transparent)',
                animation: 'float 6s ease-in-out infinite',
                zIndex: 0
              }} />
              <Box sx={{
                position: 'absolute',
                bottom: -80,
                right: -80,
                width: 160,
                height: 160,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(240, 147, 251, 0.1), transparent)',
                animation: 'float 6s ease-in-out infinite 3s',
                zIndex: 0
              }} />
              
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, type: "spring" }}
                >
                  <Typography 
                    variant="h2" 
                    component="h1" 
                    gutterBottom 
                    className="gradient-text"
                    sx={{ 
                      fontWeight: 800,
                      mb: 3,
                      fontSize: { xs: '2.5rem', md: '3.5rem' }
                    }}
                  >
                    Bienvenido a Moestilos
                  </Typography>
                </motion.div>
                
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <Typography variant="h5" color="text.secondary" paragraph sx={{ 
                    fontWeight: 400, 
                    mb: 4,
                    maxWidth: '600px',
                    mx: 'auto',
                    lineHeight: 1.6
                  }}>
                    ✨ Tu belleza es nuestra pasión. Descubre nuestros servicios profesionales de alta calidad.
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mb: 4 }}>
                    <Chip 
                      icon={<Star />} 
                      label="Profesionales Certificados" 
                      variant="outlined"
                      className="hover-lift"
                      sx={{
                        py: 2,
                        px: 1,
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        borderColor: '#667eea',
                        color: '#667eea',
                        '&:hover': {
                          background: 'rgba(102, 126, 234, 0.1)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    />
                    <Chip 
                      icon={<Schedule />} 
                      label="Reservas Online 24/7" 
                      variant="outlined"
                      className="hover-lift"
                      sx={{
                        py: 2,
                        px: 1,
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        borderColor: '#f093fb',
                        color: '#f093fb',
                        '&:hover': {
                          background: 'rgba(240, 147, 251, 0.1)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    />
                    <Chip 
                      icon={<ContentCut />} 
                      label="Últimas Tendencias" 
                      variant="outlined"
                      className="hover-lift"
                      sx={{
                        py: 2,
                        px: 1,
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        borderColor: '#10b981',
                        color: '#10b981',
                        '&:hover': {
                          background: 'rgba(16, 185, 129, 0.1)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    />
                  </Stack>
                </motion.div>

                {!user && (
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                  >
                    <Alert 
                      severity="info" 
                      sx={{ 
                        mt: 3, 
                        maxWidth: 650, 
                        mx: 'auto',
                        background: 'rgba(102, 126, 234, 0.1)',
                        border: '1px solid rgba(102, 126, 234, 0.2)',
                        borderRadius: '16px',
                        backdropFilter: 'blur(10px)',
                        '& .MuiAlert-icon': { 
                          color: '#667eea'
                        }
                      }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 500, color: '#1e293b' }}>
                        💡 Puedes explorar nuestros servicios libremente. Para reservar una cita necesitas crear una cuenta.
                      </Typography>
                    </Alert>
                  </motion.div>
                )}
              </Box>
            </Box>
          </motion.div>

          {/* Services Section Mejorada */}
          <motion.div variants={itemVariants}>
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom 
              sx={{ 
                textAlign: 'center', 
                mb: 4,
                fontWeight: 700,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Nuestros Servicios
            </Typography>

            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
              gap: 3, 
              mb: 6 
            }}>
              {services.map((service) => (
                <motion.div
                  key={service._id}
                  whileHover={{ 
                    y: -8,
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    border: '2px solid #000000',
                    background: '#ffffff',
                    borderRadius: 2,
                    boxShadow: '4px 4px 0px #000000',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translate(-2px, -2px)',
                      boxShadow: '6px 6px 0px #000000'
                    }
                  }}>
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                        <Avatar sx={{ 
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                          width: 48,
                          height: 48
                        }}>
                          {getCategoryIcon(service.categoria)}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {service.nombre}
                          </Typography>
                          <Chip 
                            label={service.categoria.toUpperCase()} 
                            color={getCategoryColor(service.categoria) as any}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                      </Stack>
                      
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        paragraph 
                        sx={{ 
                          mb: 3,
                          lineHeight: 1.6,
                          minHeight: 40
                        }}
                      >
                        {service.descripcion}
                      </Typography>
                      
                      <Divider sx={{ mb: 2, opacity: 0.3 }} />
                      
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            fontWeight: 700,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                          }}
                        >
                          ${service.precio}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <AccessTime fontSize="small" color="action" />
                          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                            {service.duracion} min
                          </Typography>
                        </Stack>
                      </Stack>
                      
                      <Button 
                        variant="contained" 
                        fullWidth
                        size="large"
                        onClick={() => handleBookAppointment(service)}
                        sx={{
                          fontWeight: 600,
                          py: 1.5,
                          backgroundColor: '#000000 !important',
                          color: '#ffffff !important',
                          border: '2px solid #000000 !important',
                          borderRadius: '8px !important',
                          boxShadow: '4px 4px 0px #333333 !important',
                          '&:hover': {
                            backgroundColor: '#333333 !important',
                            transform: 'translate(2px, 2px)',
                            boxShadow: '2px 2px 0px #333333 !important'
                          }
                        }}
                      >
                        {user ? 'Reservar Cita' : 'Iniciar Sesión para Reservar'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>
          </motion.div>

          {/* Información de contacto y horarios movida al footer para evitar duplicación */}
        </Container>

        {/* Login Dialog Mejorado */}
        <Dialog 
          open={showLoginDialog} 
          onClose={() => setShowLoginDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: '#ffffff',
              border: '2px solid #000000',
              boxShadow: '6px 6px 0px #000000'
            }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ 
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
              }}>
                <AutoAwesome />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Inicia Sesión para Reservar
              </Typography>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              Para reservar el servicio <strong>"{selectedService?.nombre}"</strong> necesitas tener una cuenta.
            </Typography>
            <Typography color="text.secondary">
              ¿Te gustaría iniciar sesión o crear una cuenta nueva?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button 
              onClick={() => setShowLoginDialog(false)}
              sx={{ fontWeight: 600 }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleLogin} 
              variant="contained"
              sx={{ 
                fontWeight: 600,
                px: 3,
                backgroundColor: '#000000 !important',
                color: '#ffffff !important',
                border: '2px solid #000000 !important',
                borderRadius: '8px !important',
                boxShadow: '4px 4px 0px #333333 !important',
                '&:hover': {
                  backgroundColor: '#333333 !important',
                  transform: 'translate(2px, 2px)',
                  boxShadow: '2px 2px 0px #333333 !important'
                }
              }}
            >
              Iniciar Sesión / Registrarse
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </motion.div>
  );
};

export default Home;
