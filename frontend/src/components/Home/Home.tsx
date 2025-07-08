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
  Stack,
  Avatar
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
  ArrowForward,
  Phone,
  Email,
  LocationOn
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

interface Testimonial {
  id: number;
  name: string;
  service: string;
  rating: number;
  comment: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "María González",
    service: "Corte y Peinado",
    rating: 5,
    comment: "Experiencia excepcional. El equipo es altamente profesional y el resultado superó mis expectativas.",
    avatar: "/img/avatar1.jpg"
  },
  {
    id: 2,
    name: "Ana Martínez",
    service: "Color y Mechas",
    rating: 5,
    comment: "El mejor salon de la ciudad. Técnicas modernas y atención personalizada de primera calidad.",
    avatar: "/img/avatar2.jpg"
  },
  {
    id: 3,
    name: "Carmen Ruiz",
    service: "Tratamiento Capilar",
    rating: 5,
    comment: "Resultados increíbles. Mi cabello nunca había estado tan saludable y radiante.",
    avatar: "/img/avatar3.jpg"
  }
];

const features = [
  {
    icon: <ContentCut sx={{ fontSize: 32, color: '#b45309' }} />,
    title: "Técnicas Avanzadas",
    description: "Utilizamos las últimas técnicas y tendencias en estilismo profesional"
  },
  {
    icon: <Spa sx={{ fontSize: 32, color: '#b45309' }} />,
    title: "Productos Premium",
    description: "Solo trabajamos con productos de la más alta calidad y marcas reconocidas"
  },
  {
    icon: <Star sx={{ fontSize: 32, color: '#b45309' }} />,
    title: "Experiencia Única",
    description: "Cada visita es una experiencia personalizada y relajante"
  },
  {
    icon: <Schedule sx={{ fontSize: 32, color: '#b45309' }} />,
    title: "Flexibilidad Horaria",
    description: "Horarios adaptados a tu agenda con disponibilidad extendida"
  }
];

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

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

  const handleBookAppointment = (service: Service) => {
    if (!user) {
      setSelectedService(service);
      setShowLoginDialog(true);
    } else {
      navigate('/dashboard?section=newAppointment');
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginDialog(false);
    navigate('/auth');
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
    <Box sx={{ 
      minHeight: '100vh',
      background: 'transparent',
      position: 'relative'
    }}>
      {/* Hero Section */}
      <Container maxWidth="xl" sx={{ pt: { xs: 8, md: 12 }, pb: { xs: 8, md: 16 } }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 4 }}>
            <Box sx={{ flex: 1 }}>
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h1"
                  className="elegant-title"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
                    fontWeight: 700,
                    lineHeight: 1.1,
                    mb: 3,
                  }}
                >
                  Salón de Belleza
                  <br />
                  <span className="luxury-accent">Experto</span>
                </Typography>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h5"
                  className="refined-text"
                  sx={{
                    mb: 4,
                    fontWeight: 400,
                    lineHeight: 1.6,
                    maxWidth: '500px',
                    fontSize: { xs: '1.125rem', md: '1.25rem' }
                  }}
                >
                  Transformamos tu estilo con <span className="luxury-accent">técnicas profesionales de vanguardia</span> 
                  y una experiencia de lujo personalizada.
                </Typography>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    onClick={() => navigate('/dashboard?section=newAppointment')}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                      boxShadow: '0 8px 32px rgba(15, 23, 42, 0.3)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 48px rgba(15, 23, 42, 0.4)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Reservar Cita
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                    sx={{
                      px: 4,
                      py: 1.5,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      border: '2px solid #e2e8f0',
                      color: '#475569',
                      '&:hover': {
                        border: '2px solid #0f172a',
                        background: 'rgba(15, 23, 42, 0.05)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Ver Servicios
                  </Button>
                </Stack>
              </motion.div>
            </Box>

            <Box sx={{ flex: 1 }}>
              <motion.div variants={itemVariants}>
                <Box
                  sx={{
                    position: 'relative',
                    height: { xs: 400, md: 600 },
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(135deg, rgba(180, 83, 9, 0.1) 0%, rgba(15, 23, 42, 0.1) 100%)',
                      zIndex: 1
                    }
                  }}
                >
                  <Box
                    component="img"
                    src="/fotoA.png"
                    alt="Imagen de Inicio"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  />
                </Box>
              </motion.div>
            </Box>
          </Box>
        </motion.div>
      </Container>

      {/* Features Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(10px)' }}>
        <Container maxWidth="xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography
                variant="h2"
                className="elegant-subtitle"
                sx={{
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontWeight: 700,
                  mb: 3,
                }}
              >
                ¿Por qué elegir nuestro <span className="text-shimmer">salón</span>?
              </Typography>
              <Typography
                variant="h6"
                className="refined-text"
                sx={{
                  maxWidth: '600px',
                  mx: 'auto',
                  lineHeight: 1.6,
                  fontSize: '1.125rem'
                }}
              >
                Ofrecemos una experiencia única combinando <span className="luxury-accent">técnicas avanzadas</span>, 
                productos de primera calidad y un servicio personalizado excepcional.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {features.map((feature, index) => (
                <Box key={index} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)', lg: '1 1 calc(25% - 24px)' } }}>
                  <motion.div variants={itemVariants}>
                    <Card
                      className="glass-card"
                      sx={{
                        height: '100%',
                        textAlign: 'center',
                        p: 3,
                        borderRadius: 3,
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                        }
                      }}
                    >
                      <Box sx={{ mb: 2 }}>
                        {feature.icon}
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          mb: 2,
                          color: '#0f172a'
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#64748b',
                          lineHeight: 1.6
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </Card>
                  </motion.div>
                </Box>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Services Section */}
      <Box id="services" sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center', mb: 8 }}>                <Typography
                  variant="h2"
                  className="elegant-subtitle"
                  sx={{
                    fontSize: { xs: '2rem', md: '3rem' },
                    fontWeight: 700,
                    mb: 3,
                  }}
                >
                  Nuestros <span className="text-glow">Servicios</span>
                </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#64748b',
                  maxWidth: '600px',
                  mx: 'auto',
                  lineHeight: 1.6
                }}
              >
                Descubre nuestra amplia gama de servicios profesionales 
                diseñados para realzar tu belleza natural.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {services.map((service) => (
                <Box key={service._id} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)', md: '1 1 calc(33.333% - 21.333px)' } }}>
                  <motion.div variants={itemVariants}>
                    <Card
                      className="glass-card"
                      sx={{
                        height: '100%',
                        borderRadius: 3,
                        overflow: 'hidden',
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {getCategoryIcon(service.categoria)}
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 600,
                                color: '#0f172a'
                              }}
                            >
                              {service.nombre}
                            </Typography>
                          </Box>
                          <Chip
                            label={service.categoria}
                            color={getCategoryColor(service.categoria) as any}
                            size="small"
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </Box>

                        <Typography
                          variant="body2"
                          sx={{
                            color: '#64748b',
                            mb: 3,
                            lineHeight: 1.6
                          }}
                        >
                          {service.descripcion}
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: 700,
                              color: '#b45309'
                            }}
                          >
                            ${service.precio}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <AccessTime sx={{ fontSize: 16, color: '#64748b' }} />
                            <Typography
                              variant="body2"
                              sx={{ color: '#64748b' }}
                            >
                              {service.duracion} min
                            </Typography>
                          </Box>
                        </Box>

                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => handleBookAppointment(service)}
                          sx={{
                            py: 1.5,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                            }
                          }}
                        >
                          Reservar Ahora
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Box>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(8px)' }}>
        <Container maxWidth="xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontWeight: 700,
                  mb: 3,
                  color: '#0f172a'
                }}
              >
                Lo que dicen nuestros clientes
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#64748b',
                  maxWidth: '600px',
                  mx: 'auto',
                  lineHeight: 1.6
                }}
              >
                La satisfacción de nuestros clientes es nuestra mayor recompensa.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {testimonials.map((testimonial) => (
                <Box key={testimonial.id} sx={{ flex: { xs: '1 1 100%', md: '1 1 calc(33.333% - 21.333px)' } }}>
                  <motion.div variants={itemVariants}>
                    <Card
                      className="glass-card"
                      sx={{
                        height: '100%',
                        p: 3,
                        borderRadius: 3,
                        position: 'relative',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          sx={{
                            width: 60,
                            height: 60,
                            mr: 2,
                            border: '3px solid #b45309'
                          }}
                        />
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              color: '#0f172a',
                              mb: 0.5
                            }}
                          >
                            {testimonial.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: '#64748b' }}
                          >
                            {testimonial.service}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', mb: 2 }}>
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} sx={{ color: '#ffd700', fontSize: 20 }} />
                        ))}
                      </Box>

                      <Typography
                        variant="body2"
                        sx={{
                          color: '#64748b',
                          fontStyle: 'italic',
                          lineHeight: 1.6
                        }}
                      >
                        "{testimonial.comment}"
                      </Typography>
                    </Card>
                  </motion.div>
                </Box>
              ))}
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', md: '3rem' },
                  fontWeight: 700,
                  mb: 3,
                  color: '#0f172a'
                }}
              >
                Contáctanos
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#64748b',
                  maxWidth: '600px',
                  mx: 'auto',
                  lineHeight: 1.6
                }}
              >
                Estamos aquí para ayudarte. Contáctanos para más información o para reservar tu cita.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(33.333% - 21.333px)' } }}>
                <motion.div variants={itemVariants}>
                  <Card
                    className="glass-card"
                    sx={{
                      textAlign: 'center',
                      p: 3,
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                      }
                    }}
                  >
                    <Phone sx={{ fontSize: 40, color: '#b45309', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#0f172a' }}>
                      Teléfono
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      +34 123 456 789
                    </Typography>
                  </Card>
                </motion.div>
              </Box>

              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(33.333% - 21.333px)' } }}>
                <motion.div variants={itemVariants}>
                  <Card
                    className="glass-card"
                    sx={{
                      textAlign: 'center',
                      p: 3,
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                      }
                    }}
                  >
                    <Email sx={{ fontSize: 40, color: '#b45309', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#0f172a' }}>
                      Email
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      info@salonbelleza.com
                    </Typography>
                  </Card>
                </motion.div>
              </Box>

              <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(33.333% - 21.333px)' } }}>
                <motion.div variants={itemVariants}>
                  <Card
                    className="glass-card"
                    sx={{
                      textAlign: 'center',
                      p: 3,
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                      }
                    }}
                  >
                    <LocationOn sx={{ fontSize: 40, color: '#b45309', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#0f172a' }}>
                      Dirección
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      Calle Principal 123, Madrid
                    </Typography>
                  </Card>
                </motion.div>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Login Dialog */}
      <Dialog
        open={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          <AutoAwesome sx={{ fontSize: 40, color: '#b45309', mb: 1 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#0f172a' }}>
            Iniciar Sesión Requerido
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Para reservar el servicio <strong>{selectedService?.nombre}</strong>, 
            necesitas iniciar sesión en tu cuenta.
          </Alert>
          <Typography variant="body2" sx={{ color: '#64748b', textAlign: 'center' }}>
            Si aún no tienes cuenta, podrás crear una nueva durante el proceso de inicio de sesión.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
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
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              }
            }}
          >
            Iniciar Sesión
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Home;
