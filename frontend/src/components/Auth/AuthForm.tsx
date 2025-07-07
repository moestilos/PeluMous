import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Tab,
  Tabs,
  IconButton,
  Stack,
  Divider,
  InputAdornment
} from '@mui/material';
import { 
  ArrowBack,
  Email,
  Lock,
  Person,
  Phone,
  Visibility,
  VisibilityOff 
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0, mt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AuthForm: React.FC = () => {
  const [tab, setTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    nombre: '',
    email: '',
    password: '',
    telefono: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(loginData.email, loginData.password);
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await register(registerData);
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundImage: 'url(/img/fondo.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2
    }}>
      <Container component="main" maxWidth="md">
        <Box sx={{ 
          display: { xs: 'block', md: 'flex' }, 
          gap: { md: 4 }, 
          alignItems: 'stretch', 
          minHeight: { md: '600px' } 
        }}>
          
          {/* Panel izquierdo - Información */}
          <Paper sx={{ 
            flex: { md: 1 },
            p: { xs: 4, md: 6 },
            mb: { xs: 3, md: 0 },
            backgroundColor: '#000000 !important',
            color: '#ffffff !important',
            border: '3px solid #000000 !important',
            borderRadius: { 
              xs: '16px !important', 
              md: '16px 0 0 16px !important' 
            },
            boxShadow: 'none !important',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Elementos decorativos */}
            <Box sx={{
              position: 'absolute',
              top: -50,
              left: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
              zIndex: 0
            }} />
            <Box sx={{
              position: 'absolute',
              bottom: -30,
              right: -30,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.03)',
              zIndex: 0
            }} />
            
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h3" sx={{ 
                fontWeight: 800, 
                mb: 3,
                color: '#ffffff !important'
              }}>
                Moestilos
              </Typography>
              
              <Typography variant="h5" sx={{ 
                fontWeight: 400, 
                mb: 4,
                color: '#ffffff !important',
                lineHeight: 1.4
              }}>
                Tu centro de belleza profesional
              </Typography>
              
              <Stack spacing={2} sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    backgroundColor: '#ffffff',
                    opacity: 0.8 
                  }} />
                  <Typography variant="body1" sx={{ color: '#ffffff !important' }}>
                    Servicios profesionales de calidad
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    backgroundColor: '#ffffff'
                  }} />
                  <Typography variant="body1" sx={{ color: '#ffffff !important' }}>
                    Reservas online las 24 horas
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    width: 8, 
                    height: 8, 
                    borderRadius: '50%', 
                    backgroundColor: '#ffffff'
                  }} />
                  <Typography variant="body1" sx={{ color: '#ffffff !important' }}>
                    Profesionales certificados
                  </Typography>
                </Box>
              </Stack>
              
              <Typography variant="body2" sx={{ 
                color: '#ffffff !important',
                fontStyle: 'italic'
              }}>
                "Donde tu belleza cobra vida"
              </Typography>
            </Box>
          </Paper>

          {/* Panel derecho - Formulario */}
          <Paper sx={{ 
            flex: { md: 1 },
            p: { xs: 4, md: 6 },
            backgroundColor: '#ffffff !important',
            border: '3px solid #000000 !important',
            borderRadius: { 
              xs: '16px !important', 
              md: '0 16px 16px 0 !important' 
            },
            boxShadow: '8px 8px 0px #000000 !important',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Header con botón de regreso */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <IconButton 
                onClick={() => navigate('/')} 
                sx={{ 
                  mr: 2,
                  backgroundColor: '#ffffff',
                  border: '2px solid #000000',
                  borderRadius: '8px',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    transform: 'translate(2px, 2px)',
                    boxShadow: '2px 2px 0px #000000'
                  }
                }}
              >
                <ArrowBack />
              </IconButton>
              <Typography variant="h5" sx={{ 
                fontWeight: 700,
                color: '#000000'
              }}>
                {tab === 0 ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </Typography>
            </Box>

            {/* Tabs mejorados */}
            <Box sx={{ mb: 4 }}>
              <Tabs 
                value={tab} 
                onChange={handleTabChange} 
                sx={{
                  '& .MuiTabs-root': {
                    minHeight: 'auto'
                  },
                  '& .MuiTab-root': {
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: '#666666',
                    textTransform: 'none',
                    padding: '12px 24px',
                    minHeight: 'auto',
                    border: '2px solid transparent',
                    borderRadius: '8px 8px 0 0',
                    marginRight: '4px',
                    '&.Mui-selected': {
                      color: '#000000',
                      backgroundColor: '#f8f9fa',
                      border: '2px solid #000000',
                      borderBottom: '2px solid #f8f9fa'
                    },
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                      color: '#000000'
                    }
                  },
                  '& .MuiTabs-indicator': {
                    display: 'none'
                  }
                }}
              >
                <Tab label="Iniciar Sesión" />
                <Tab label="Registrarse" />
              </Tabs>
              <Divider sx={{ 
                borderColor: '#000000', 
                borderWidth: 1,
                mt: -0.25
              }} />
            </Box>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  backgroundColor: '#fff5f5 !important',
                  border: '2px solid #dc2626 !important',
                  borderRadius: '8px !important',
                  color: '#dc2626 !important',
                  '& .MuiAlert-icon': {
                    color: '#dc2626 !important'
                  }
                }}
              >
                {error}
              </Alert>
            )}

            {/* Formularios */}
            <Box sx={{ flexGrow: 1 }}>
              <TabPanel value={tab} index={0}>
                <Box component="form" onSubmit={handleLogin} sx={{ height: '100%' }}>
                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      label="Correo Electrónico"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: '#666666' }} />
                          </InputAdornment>
                        ),
                      }}
                      required
                    />
                    
                    <TextField
                      fullWidth
                      label="Contraseña"
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: '#666666' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{ color: '#666666' }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      required
                    />
                    
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={loading}
                      sx={{ 
                        mt: 4,
                        py: 1.5,
                        backgroundColor: '#000000 !important',
                        color: '#ffffff !important',
                        border: '2px solid #000000 !important',
                        borderRadius: '12px !important',
                        boxShadow: '4px 4px 0px #333333 !important',
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        textTransform: 'none',
                        '&:hover': {
                          backgroundColor: '#333333 !important',
                          transform: 'translate(2px, 2px)',
                          boxShadow: '2px 2px 0px #333333 !important'
                        },
                        '&:disabled': {
                          backgroundColor: '#666666 !important',
                          color: '#cccccc !important',
                          transform: 'none',
                          boxShadow: '4px 4px 0px #999999 !important'
                        }
                      }}
                    >
                      {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </Button>
                  </Stack>
                </Box>
              </TabPanel>

              <TabPanel value={tab} index={1}>
                <Box component="form" onSubmit={handleRegister}>
                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      label="Nombre Completo"
                      value={registerData.nombre}
                      onChange={(e) => setRegisterData({ ...registerData, nombre: e.target.value })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person sx={{ color: '#666666' }} />
                          </InputAdornment>
                        ),
                      }}
                      required
                    />
                    
                    <TextField
                      fullWidth
                      label="Correo Electrónico"
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: '#666666' }} />
                          </InputAdornment>
                        ),
                      }}
                      required
                    />
                    
                    <TextField
                      fullWidth
                      label="Teléfono"
                      value={registerData.telefono}
                      onChange={(e) => setRegisterData({ ...registerData, telefono: e.target.value })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone sx={{ color: '#666666' }} />
                          </InputAdornment>
                        ),
                      }}
                      required
                    />
                    
                    <TextField
                      fullWidth
                      label="Contraseña"
                      type={showRegisterPassword ? 'text' : 'password'}
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ color: '#666666' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                              edge="end"
                              sx={{ color: '#666666' }}
                            >
                              {showRegisterPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      required
                    />
                    
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      disabled={loading}
                      sx={{ 
                        mt: 4,
                        py: 1.5,
                        backgroundColor: '#000000 !important',
                        color: '#ffffff !important',
                        border: '2px solid #000000 !important',
                        borderRadius: '12px !important',
                        boxShadow: '4px 4px 0px #333333 !important',
                        fontWeight: 600,
                        fontSize: '1.1rem',
                        textTransform: 'none',
                        '&:hover': {
                          backgroundColor: '#333333 !important',
                          transform: 'translate(2px, 2px)',
                          boxShadow: '2px 2px 0px #333333 !important'
                        },
                        '&:disabled': {
                          backgroundColor: '#666666 !important',
                          color: '#cccccc !important',
                          transform: 'none',
                          boxShadow: '4px 4px 0px #999999 !important'
                        }
                      }}
                    >
                      {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                    </Button>
                  </Stack>
                </Box>
              </TabPanel>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default AuthForm;
