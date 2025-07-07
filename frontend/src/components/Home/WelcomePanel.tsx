import React from 'react';
import { motion } from 'framer-motion';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Stack
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const WelcomePanel: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/auth');
  };

  const handleDashboardRedirect = () => {
    navigate('/dashboard');
  };

  const handleHairdresserRedirect = () => {
    navigate('/hairdresser');
  };

  const handleAdminRedirect = () => {
    navigate('/admin');
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
        duration: 0.4
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Box sx={{ mb: 6 }}>
        <Stack spacing={5}>
          {/* Hero Section Principal */}
          <motion.div variants={itemVariants}>
            <Box sx={{ 
              textAlign: 'center',
              py: { xs: 6, md: 8 },
              px: { xs: 2, md: 4 }
            }}>
              <Typography variant="h1" sx={{ 
                fontWeight: 800, 
                mb: 3,
                fontSize: { xs: '3rem', md: '4.5rem' },
                color: '#000000',
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                letterSpacing: '-0.02em'
              }}>
                Bienvenido a Moestilos
              </Typography>
              
              <Typography variant="h5" sx={{ 
                mb: 4,
                fontSize: { xs: '1.2rem', md: '1.4rem' },
                color: '#333333',
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.4
              }}>
                Tu centro de belleza profesional donde el estilo se encuentra con la excelencia
              </Typography>

              {user && (
                <Box sx={{
                  display: 'inline-block',
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  border: '2px solid #000000',
                  borderRadius: 3,
                  px: 4,
                  py: 2,
                  mb: 4
                }}>
                  <Typography variant="h6" sx={{ 
                    color: '#000000',
                    fontWeight: 600
                  }}>
                    Hola, {user.nombre}
                  </Typography>
                </Box>
              )}
            </Box>
          </motion.div>

          {/* Sección de Acceso Mejorada */}
          <motion.div variants={itemVariants}>
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'center',
              px: { xs: 2, md: 4 }
            }}>
              <Card sx={{ 
                maxWidth: '500px',
                width: '100%',
                backgroundColor: '#ffffff',
                border: '3px solid #000000',
                borderRadius: 4,
                boxShadow: '8px 8px 0px #000000',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translate(-2px, -2px)',
                  boxShadow: '12px 12px 0px #000000'
                }
              }}>
                <CardContent sx={{ p: 5 }}>
                  <Stack spacing={4} alignItems="center">
                    <Box sx={{ 
                      width: 80,
                      height: 80,
                      backgroundColor: '#000000',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '2rem'
                    }}>
                      {!user ? '🔐' : 
                       user.rol === 'admin' ? '👑' : 
                       user.rol === 'peluquero' ? '✂️' : '👤'}
                    </Box>
                    
                    <Typography variant="h4" sx={{ 
                      fontWeight: 700,
                      color: '#000000',
                      textAlign: 'center'
                    }}>
                      {!user ? 'Acceso al Sistema' : 'Tu Panel'}
                    </Typography>
                    
                    <Stack 
                      spacing={2} 
                      sx={{ width: '100%' }}
                    >
                      {!user ? (
                        <Button 
                          variant="contained" 
                          size="large"
                          onClick={handleLoginRedirect}
                          fullWidth
                          sx={{ 
                            fontWeight: 700, 
                            py: 2,
                            backgroundColor: '#000000',
                            fontSize: '1.1rem',
                            borderRadius: 2,
                            border: '2px solid transparent',
                            '&:hover': {
                              backgroundColor: '#000000',
                              border: '2px solid #333333',
                              transform: 'translateY(-2px)'
                            },
                            transition: 'all 0.2s ease'
                          }}
                        >
                          Iniciar Sesión
                        </Button>
                      ) : (
                        <>
                          <Button 
                            variant="contained" 
                            size="large"
                            onClick={handleDashboardRedirect}
                            fullWidth
                            sx={{ 
                              fontWeight: 700, 
                              py: 2,
                              backgroundColor: '#000000',
                              fontSize: '1rem',
                              borderRadius: 2,
                              border: '2px solid transparent',
                              '&:hover': {
                                backgroundColor: '#000000',
                                border: '2px solid #333333',
                                transform: 'translateY(-2px)'
                              },
                              transition: 'all 0.2s ease'
                            }}
                          >
                            Mi Dashboard
                          </Button>
                          
                          {user.rol === 'admin' && (
                            <Button 
                              variant="outlined" 
                              size="large"
                              onClick={handleAdminRedirect}
                              fullWidth
                              sx={{ 
                                fontWeight: 700, 
                                py: 2,
                                borderColor: '#000000',
                                color: '#000000',
                                fontSize: '1rem',
                                borderRadius: 2,
                                borderWidth: '2px',
                                '&:hover': {
                                  borderColor: '#000000',
                                  color: '#000000',
                                  backgroundColor: 'rgba(0,0,0,0.05)',
                                  transform: 'translateY(-2px)',
                                  borderWidth: '2px'
                                },
                                transition: 'all 0.2s ease'
                              }}
                            >
                              Panel Administrador
                            </Button>
                          )}
                          
                          {user.rol === 'peluquero' && (
                            <Button 
                              variant="outlined" 
                              size="large"
                              onClick={handleHairdresserRedirect}
                              fullWidth
                              sx={{ 
                                fontWeight: 700, 
                                py: 2,
                                borderColor: '#000000',
                                color: '#000000',
                                fontSize: '1rem',
                                borderRadius: 2,
                                borderWidth: '2px',
                                '&:hover': {
                                  borderColor: '#000000',
                                  color: '#000000',
                                  backgroundColor: 'rgba(0,0,0,0.05)',
                                  transform: 'translateY(-2px)',
                                  borderWidth: '2px'
                                },
                                transition: 'all 0.2s ease'
                              }}
                            >
                              Panel Peluquero
                            </Button>
                          )}
                        </>
                      )}
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          </motion.div>
        </Stack>
      </Box>
    </motion.div>
  );
};

export default WelcomePanel;
