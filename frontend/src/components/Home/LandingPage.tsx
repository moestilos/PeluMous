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
  Stack,
  Avatar,
  Paper,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  ContentCut,
  Palette,
  Face,
  Spa,
  AccessTime,
  Star,
  Schedule,
  AutoAwesome,
  CheckCircle,
  TrendingUp,
  EmojiEvents
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Service {
  _id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion: number;
  categoria: string;
}

const LandingPage: React.FC = () => {
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
      console.error('Error fetching services:', error);
    }
  };

  const handleBookAppointment = (service: Service) => {
    if (user) {
      navigate('/dashboard?section=newAppointment');
    } else {
      setSelectedService(service);
      setShowLoginDialog(true);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/auth');
  };

  const getCategoryIcon = (categoria: string) => {
    switch (categoria.toLowerCase()) {
      case 'corte': return <ContentCut />;
      case 'coloración': return <Palette />;
      case 'facial': return <Face />;
      case 'spa': return <Spa />;
      default: return <Star />;
    }
  };

  const getCategoryColor = (categoria: string) => {
    switch (categoria.toLowerCase()) {
      case 'corte': return 'primary';
      case 'coloración': return 'secondary';
      case 'facial': return 'info';
      case 'spa': return 'success';
      default: return 'default';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
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
      <Box sx={{ 
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        pt: 2
      }}>
        {/* Hero Section */}
        <motion.div variants={itemVariants}>
          <Container maxWidth="lg" sx={{ py: 8 }}>
            <Card sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: 'white',
              borderRadius: 4,
              overflow: 'hidden',
              position: 'relative',
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center'
            }}>
              {/* Elementos decorativos */}
              <Box sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: alpha('#ffffff', 0.1),
                filter: 'blur(40px)'
              }} />
              <Box sx={{
                position: 'absolute',
                bottom: -30,
                left: -30,
                width: 150,
                height: 150,
                borderRadius: '50%',
                background: alpha('#ffffff', 0.08),
                filter: 'blur(30px)'
              }} />
              
              <CardContent sx={{ p: 8, position: 'relative', zIndex: 1, width: '100%' }}>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
                  <Box sx={{ flex: 1 }}>
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    >
                      <Typography variant="h1" sx={{ 
                        fontWeight: 800, 
                        mb: 3,
                        fontSize: { xs: '2.5rem', md: '3.5rem' },
                        textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                      }}>
                        Bienvenido a Moestilos
                      </Typography>
                      
                      <Typography variant="h5" sx={{ 
                        mb: 4, 
                        opacity: 0.95,
                        fontSize: { xs: '1.2rem', md: '1.5rem' },
                        lineHeight: 1.4
                      }}>
                        Tu centro de belleza profesional donde cada servicio es una experiencia única
                      </Typography>
                      
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                        <Chip 
                          icon={<Star />} 
                          label="Profesionales Certificados" 
                          sx={{
                            background: alpha('#ffffff', 0.2),
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            py: 2,
                            px: 1
                          }}
                        />
                        <Chip 
                          icon={<Schedule />} 
                          label="Reservas Online 24/7" 
                          sx={{
                            background: alpha('#ffffff', 0.2),
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            py: 2,
                            px: 1
                          }}
                        />
                        <Chip 
                          icon={<EmojiEvents />} 
                          label="Calidad Premium" 
                          sx={{
                            background: alpha('#ffffff', 0.2),
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            py: 2,
                            px: 1
                          }}
                        />
                      </Stack>
                      
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Button 
                          variant="contained" 
                          size="large"
                          onClick={handleLoginRedirect}
                          sx={{
                            backgroundColor: '#ffffff',
                            color: theme.palette.primary.main,
                            fontWeight: 700,
                            py: 2,
                            px: 4,
                            borderRadius: 2,
                            fontSize: '1.1rem',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                            '&:hover': {
                              backgroundColor: alpha('#ffffff', 0.9),
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
                            }
                          }}
                        >
                          Reservar Cita
                        </Button>
                        
                        <Button 
                          variant="outlined" 
                          size="large"
                          onClick={() => {
                            const servicesSection = document.getElementById('services-section');
                            servicesSection?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          sx={{
                            borderColor: '#ffffff',
                            color: '#ffffff',
                            fontWeight: 600,
                            py: 2,
                            px: 4,
                            borderRadius: 2,
                            fontSize: '1.1rem',
                            '&:hover': {
                              borderColor: '#ffffff',
                              backgroundColor: alpha('#ffffff', 0.1),
                              transform: 'translateY(-2px)'
                            }
                          }}
                        >
                          Ver Servicios
                        </Button>
                      </Stack>
                    </motion.div>
                  </Box>
                  
                  <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
                    <motion.div
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    >
                      <Box sx={{ textAlign: 'center' }}>
                        <Avatar sx={{ 
                          width: 120, 
                          height: 120, 
                          mx: 'auto', 
                          mb: 3,
                          background: alpha('#ffffff', 0.2),
                          fontSize: '3rem',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                        }}>
                          ✂️
                        </Avatar>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 600,
                          mb: 1
                        }}>
                          Experiencia Premium
                        </Typography>
                        <Typography variant="body1" sx={{ 
                          opacity: 0.9
                        }}>
                          Más de 10 años creando estilos únicos
                        </Typography>
                      </Box>
                    </motion.div>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Container>
        </motion.div>

        {/* Services Section */}
        <motion.div variants={itemVariants} id="services-section">
          <Container maxWidth="lg" sx={{ py: 8 }}>
            <Typography 
              variant="h2" 
              component="h2" 
              gutterBottom 
              sx={{ 
                textAlign: 'center', 
                mb: 6,
                fontWeight: 800,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              🌟 Nuestros Servicios
            </Typography>

            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
              gap: 4 
            }}>
              {services.map((service, index) => (
                <Box key={service._id}>
                  <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card sx={{
                      height: '100%',
                      background: '#ffffff',
                      border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        border: `2px solid ${theme.palette.primary.main}`,
                        boxShadow: `0 12px 40px ${alpha(theme.palette.primary.main, 0.2)}`
                      }
                    }}>
                      <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                          <Avatar sx={{
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            width: 56,
                            height: 56
                          }}>
                            {getCategoryIcon(service.categoria)}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" component="h3" sx={{ fontWeight: 700, mb: 0.5 }}>
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
                          variant="body1" 
                          color="text.secondary" 
                          paragraph 
                          sx={{ 
                            mb: 'auto',
                            lineHeight: 1.6,
                            flex: 1
                          }}
                        >
                          {service.descripcion}
                        </Typography>
                        
                        <Divider sx={{ mb: 3 }} />
                        
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                          <Typography 
                            variant="h4" 
                            sx={{ 
                              fontWeight: 800,
                              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                              backgroundClip: 'text',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent'
                            }}
                          >
                            ${service.precio}
                          </Typography>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <AccessTime fontSize="small" sx={{ color: theme.palette.primary.main }} />
                            <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
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
                            fontWeight: 700,
                            py: 2,
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            borderRadius: 2,
                            fontSize: '1rem',
                            '&:hover': {
                              background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                              transform: 'translateY(-2px)',
                              boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.4)}`
                            }
                          }}
                        >
                          {user ? '📅 Reservar Cita' : '🔐 Iniciar Sesión para Reservar'}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Box>
              ))}
            </Box>
          </Container>
        </motion.div>

        {/* Features Section */}
        <motion.div variants={itemVariants}>
          <Container maxWidth="lg" sx={{ py: 8 }}>
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom 
              sx={{ 
                textAlign: 'center', 
                mb: 6,
                fontWeight: 700,
                color: theme.palette.text.primary
              }}
            >
              ¿Por qué elegir Moestilos?
            </Typography>

            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
              gap: 4 
            }}>
              {[
                {
                  icon: <Star sx={{ fontSize: 40 }} />,
                  title: 'Calidad Premium',
                  description: 'Utilizamos productos de alta gama y técnicas profesionales para garantizar resultados excepcionales.'
                },
                {
                  icon: <TrendingUp sx={{ fontSize: 40 }} />,
                  title: 'Últimas Tendencias',
                  description: 'Nuestro equipo se mantiene actualizado con las últimas tendencias y técnicas del mundo de la belleza.'
                },
                {
                  icon: <CheckCircle sx={{ fontSize: 40 }} />,
                  title: 'Satisfacción Garantizada',
                  description: 'Tu satisfacción es nuestra prioridad. Nos aseguramos de que salgas completamente feliz con tu nuevo look.'
                }
              ].map((feature, index) => (
                <Box key={index}>
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <Paper sx={{
                      p: 4,
                      textAlign: 'center',
                      height: '100%',
                      background: alpha(theme.palette.primary.main, 0.02),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: `0 8px 30px ${alpha(theme.palette.primary.main, 0.15)}`
                      }
                    }}>
                      <Avatar sx={{
                        width: 80,
                        height: 80,
                        mx: 'auto',
                        mb: 3,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                      }}>
                        {feature.icon}
                      </Avatar>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {feature.description}
                      </Typography>
                    </Paper>
                  </motion.div>
                </Box>
              ))}
            </Box>
          </Container>
        </motion.div>

        {/* CTA Section */}
        <motion.div variants={itemVariants}>
          <Container maxWidth="lg" sx={{ py: 8 }}>
            <Card sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.95)}, ${alpha(theme.palette.secondary.main, 0.95)})`,
              color: 'white',
              textAlign: 'center',
              borderRadius: 4,
              overflow: 'hidden',
              position: 'relative'
            }}>
              <Box sx={{
                position: 'absolute',
                top: -50,
                left: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: alpha('#ffffff', 0.1),
                filter: 'blur(40px)'
              }} />
              
              <CardContent sx={{ p: 8, position: 'relative' }}>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 3 }}>
                  ¿Listo para tu transformación?
                </Typography>
                <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
                  Únete a miles de clientes satisfechos y descubre por qué somos el centro de belleza más confiable de la ciudad.
                </Typography>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={handleLoginRedirect}
                  sx={{
                    backgroundColor: '#ffffff',
                    color: theme.palette.primary.main,
                    fontWeight: 700,
                    py: 3,
                    px: 6,
                    fontSize: '1.2rem',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    '&:hover': {
                      backgroundColor: alpha('#ffffff', 0.9),
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.3)'
                    }
                  }}
                >
                  Crear Cuenta Gratis
                </Button>
              </CardContent>
            </Card>
          </Container>
        </motion.div>

        {/* Login Dialog */}
        <Dialog 
          open={showLoginDialog} 
          onClose={() => setShowLoginDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 60px rgba(30, 41, 59, 0.2)'
            }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ 
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
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
              sx={{ color: 'text.secondary' }}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleLoginRedirect}
              variant="contained"
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                }
              }}
            >
              Iniciar Sesión
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </motion.div>
  );
};

export default LandingPage;
