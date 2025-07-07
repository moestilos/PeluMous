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
  alpha,
  Stack,
  Avatar,
  Divider
} from '@mui/material';
import {
  ContentCut,
  Palette,
  Face,
  Spa,
  Phone,
  Email,
  LocationOn,
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
              py: 6,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
              borderRadius: 3,
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Elementos decorativos */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -50,
                  left: -50,
                  width: 150,
                  height: 150,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)}, transparent)`,
                  filter: 'blur(40px)'
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -30,
                  right: -30,
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, transparent)`,
                  filter: 'blur(30px)'
                }}
              />
              
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography 
                  variant="h2" 
                  component="h1" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 800,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2
                  }}
                >
                  Bienvenido a Bella Vista
                </Typography>
                <Typography variant="h5" color="text.secondary" paragraph sx={{ fontWeight: 400, mb: 3 }}>
                  Tu belleza es nuestra pasión. Descubre nuestros servicios profesionales.
                </Typography>
                <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
                  <Chip 
                    icon={<Star />} 
                    label="Profesionales Certificados" 
                    color="primary" 
                    variant="outlined"
                    sx={{
                      background: alpha(theme.palette.primary.main, 0.1),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
                    }}
                  />
                  <Chip 
                    icon={<Schedule />} 
                    label="Reservas Online" 
                    color="secondary" 
                    variant="outlined"
                    sx={{
                      background: alpha(theme.palette.secondary.main, 0.1),
                      border: `1px solid ${alpha(theme.palette.secondary.main, 0.3)}`
                    }}
                  />
                </Stack>
                {!user && (
                  <Alert 
                    severity="info" 
                    sx={{ 
                      mt: 2, 
                      maxWidth: 600, 
                      mx: 'auto',
                      background: alpha(theme.palette.info.main, 0.1),
                      border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Puedes explorar nuestros servicios libremente. Para reservar una cita necesitas crear una cuenta.
                    </Typography>
                  </Alert>
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
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.15)}`,
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
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
                          background: user 
                            ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                            : `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`
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

          {/* Contact Section Mejorada */}
          <motion.div variants={itemVariants}>
            <Card sx={{ 
              mb: 4,
              background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.05)}`
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography 
                  variant="h4" 
                  component="h2" 
                  gutterBottom 
                  sx={{ 
                    textAlign: 'center',
                    fontWeight: 700,
                    mb: 4,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Contáctanos
                </Typography>
                <Stack 
                  direction={{ xs: 'column', md: 'row' }} 
                  spacing={4} 
                  justifyContent="center"
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ 
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      width: 48,
                      height: 48
                    }}>
                      <LocationOn />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Dirección
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Calle Bella Vista 123, Ciudad
                      </Typography>
                    </Box>
                  </Stack>
                  
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ 
                      background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                      width: 48,
                      height: 48
                    }}>
                      <Phone />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Teléfono
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        +1 234 567 8900
                      </Typography>
                    </Box>
                  </Stack>
                  
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar sx={{ 
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      width: 48,
                      height: 48
                    }}>
                      <Email />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Email
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        info@bellavista.com
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>

          {/* Hours Mejorado */}
          <motion.div variants={itemVariants}>
            <Card sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.9)} 100%)`,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.05)}`
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography 
                  variant="h5" 
                  component="h2" 
                  gutterBottom 
                  sx={{ 
                    textAlign: 'center',
                    fontWeight: 700,
                    mb: 3,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  Horarios de Atención
                </Typography>
                <Stack spacing={1} alignItems="center">
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Lunes a Viernes: 9:00 AM - 7:00 PM
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Sábados: 9:00 AM - 5:00 PM
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                    Domingos: Cerrado
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </Container>

        {/* Login Dialog Mejorado */}
        <Dialog 
          open={showLoginDialog} 
          onClose={() => setShowLoginDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.background.paper, 0.98)} 100%)`,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
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
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.4)}`
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
