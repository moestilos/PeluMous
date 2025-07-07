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
  Button,
  useTheme,
  alpha
} from '@mui/material';
import {
  EventNote,
  Add as AddIcon,
  Person,
  Star,
  AccessTime,
  CheckCircle
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import NewAppointment from '../Appointments/NewAppointment';
import MyAppointments from '../Appointments/MyAppointments';
import UserProfile from '../Profile/UserProfile';

const ClientDashboard: React.FC = () => {
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
            position: 'relative',
            borderRadius: 3,
            minHeight: '200px',
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
            
            <CardContent sx={{ p: 4, position: 'relative', zIndex: 1, width: '100%' }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center">
                <Avatar sx={{
                  width: 80,
                  height: 80,
                  background: alpha('#ffffff', 0.2),
                  color: 'white',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  border: '2px solid rgba(255, 255, 255, 0.3)'
                }}
                src={user?.profileImage ? `http://localhost:5000${user.profileImage}` : undefined}
                >
                  {!user?.profileImage && user?.nombre.charAt(0)}
                </Avatar>
                <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
                  <Typography variant="h4" sx={{ 
                    fontWeight: 800, 
                    mb: 1,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                  }}>
                    ¡Hola, {user?.nombre}! 👋
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    opacity: 0.9,
                    fontSize: '1.2rem',
                    mb: 2
                  }}>
                    Bienvenido a tu espacio personal
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    opacity: 0.8,
                    maxWidth: 600
                  }}>
                    Desde aquí puedes gestionar tus citas, ver tu historial y actualizar tu perfil de forma sencilla.
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </motion.div>

        {/* Acciones Rápidas */}
        <motion.div variants={itemVariants}>
          <Typography variant="h5" sx={{ 
            fontWeight: 700, 
            mb: 3,
            color: theme.palette.text.primary
          }}>
            ⚡ Acciones Rápidas
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: 3,
            mb: 4 
          }}>
            <Card sx={{
              height: '100%',
              background: alpha(theme.palette.primary.main, 0.05),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              borderRadius: 3,
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-4px)',
                border: `1px solid ${theme.palette.primary.main}`,
                boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.2)}`
              }
            }}
            onClick={() => navigate('/dashboard?section=newAppointment')}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Avatar sx={{
                  width: 60,
                  height: 60,
                  mx: 'auto',
                  mb: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                }}>
                  <AddIcon sx={{ fontSize: 30 }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Nueva Cita
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Reserva tu próximo servicio de belleza
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{
              height: '100%',
              background: alpha(theme.palette.info.main, 0.05),
              border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
              borderRadius: 3,
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-4px)',
                border: `1px solid ${theme.palette.info.main}`,
                boxShadow: `0 8px 25px ${alpha(theme.palette.info.main, 0.2)}`
              }
            }}
            onClick={() => navigate('/dashboard?section=myAppointments')}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Avatar sx={{
                  width: 60,
                  height: 60,
                  mx: 'auto',
                  mb: 2,
                  background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`
                }}>
                  <EventNote sx={{ fontSize: 30 }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Mis Citas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Revisa tu historial y citas programadas
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{
              height: '100%',
              background: alpha(theme.palette.success.main, 0.05),
              border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
              borderRadius: 3,
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-4px)',
                border: `1px solid ${theme.palette.success.main}`,
                boxShadow: `0 8px 25px ${alpha(theme.palette.success.main, 0.2)}`
              }
            }}
            onClick={() => navigate('/dashboard?section=profile')}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Avatar sx={{
                  width: 60,
                  height: 60,
                  mx: 'auto',
                  mb: 2,
                  background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`
                }}>
                  <Person sx={{ fontSize: 30 }} />
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Mi Perfil
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Actualiza tu información personal
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </motion.div>

        {/* Información Útil */}
        <motion.div variants={itemVariants}>
          <Typography variant="h5" sx={{ 
            fontWeight: 700, 
            mb: 3,
            color: theme.palette.text.primary
          }}>
            💡 Tips y Recomendaciones
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: 3 
          }}>
            {[
              {
                icon: <AccessTime sx={{ fontSize: 24 }} />,
                title: 'Puntualidad',
                description: 'Llega 10 minutos antes de tu cita para una mejor experiencia.',
                color: theme.palette.primary.main
              },
              {
                icon: <Star sx={{ fontSize: 24 }} />,
                title: 'Preparación',
                description: 'Trae referencias de estilos que te gusten para mejores resultados.',
                color: theme.palette.warning.main
              },
              {
                icon: <CheckCircle sx={{ fontSize: 24 }} />,
                title: 'Cuidado Post-Servicio',
                description: 'Sigue las recomendaciones de tu estilista para mantener tu look.',
                color: theme.palette.success.main
              }
            ].map((tip, index) => (
              <Card key={index} sx={{
                height: '100%',
                background: alpha(tip.color, 0.02),
                border: `1px solid ${alpha(tip.color, 0.1)}`,
                borderRadius: 3
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Avatar sx={{
                      width: 40,
                      height: 40,
                      background: alpha(tip.color, 0.1),
                      color: tip.color
                    }}>
                      {tip.icon}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {tip.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                        {tip.description}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>
        </motion.div>

        {/* CTA para volver al inicio */}
        <motion.div variants={itemVariants}>
          <Card sx={{
            mt: 4,
            background: alpha(theme.palette.secondary.main, 0.05),
            border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
            borderRadius: 3
          }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                ¿Quieres conocer más servicios?
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Explora todos nuestros servicios y descubre nuevas opciones para tu cuidado personal.
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => navigate('/')}
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                  px: 4,
                  py: 2,
                  fontWeight: 700,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 25px ${alpha(theme.palette.secondary.main, 0.3)}`
                  }
                }}
              >
                Ver Todos los Servicios
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </motion.div>
  );

  // Renderizar las diferentes secciones
  switch (section) {
    case 'newAppointment':
      return <NewAppointment />;
    case 'myAppointments':
      return <MyAppointments />;
    case 'profile':
      return <UserProfile />;
    default:
      return renderOverview();
  }
};

export default ClientDashboard;
