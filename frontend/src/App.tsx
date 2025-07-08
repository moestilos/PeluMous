import React from 'react';
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/500.css';
import '@fontsource/playfair-display/600.css';
import '@fontsource/playfair-display/700.css';
import '@fontsource/source-sans-pro/300.css';
import '@fontsource/source-sans-pro/400.css';
import '@fontsource/source-sans-pro/600.css';
import '@fontsource/source-sans-pro/700.css';
import './styles/professional-styles.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './components/Notifications/NotificationProvider';
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Layout/Footer';
import AnimatedBackground from './components/Layout/AnimatedBackground';
import AuthForm from './components/Auth/AuthForm';
import DashboardRouter from './components/Dashboard/DashboardRouter';
import HomeRedirect from './components/Home/HomeRedirect';
import AdminPanel from './components/Admin/AdminPanel';
import HairdresserPanel from './components/Hairdresser/HairdresserPanel';
import ReservationDebugger from './components/Debug/ReservationDebugger';
import SimpleNewAppointment from './components/Debug/SimpleNewAppointment';
import DebugNewAppointment from './components/Debug/DebugNewAppointment';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0f172a',
      dark: '#020617',
      light: '#1e293b',
      contrastText: '#f8fafc',
    },
    secondary: {
      main: '#b45309',
      dark: '#92400e',
      light: '#d97706',
      contrastText: '#ffffff',
    },
    background: {
      default: '#fafaf9',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
    error: {
      main: '#dc2626',
      light: '#ef4444',
      dark: '#b91c1c',
    },
    warning: {
      main: '#d97706',
      light: '#f59e0b',
      dark: '#b45309',
    },
    success: {
      main: '#059669',
      light: '#10b981',
      dark: '#047857',
    },
    info: {
      main: '#0284c7',
      light: '#0ea5e9',
      dark: '#0369a1',
    },
    grey: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
  },
  typography: {
    fontFamily: '"Source Sans Pro", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Playfair Display", "Georgia", serif',
      fontWeight: 700,
      fontSize: '4rem',
      color: '#0f172a',
      letterSpacing: '-0.02em',
      lineHeight: 1.1,
    },
    h2: {
      fontFamily: '"Playfair Display", "Georgia", serif',
      fontWeight: 600,
      fontSize: '3rem',
      color: '#0f172a',
      letterSpacing: '-0.01em',
      lineHeight: 1.2,
    },
    h3: {
      fontFamily: '"Playfair Display", "Georgia", serif',
      fontWeight: 600,
      fontSize: '2.25rem',
      color: '#0f172a',
      letterSpacing: '0em',
      lineHeight: 1.3,
    },
    h4: {
      fontFamily: '"Source Sans Pro", "Roboto", sans-serif',
      fontWeight: 600,
      fontSize: '1.875rem',
      color: '#0f172a',
      letterSpacing: '0.01em',
      lineHeight: 1.4,
    },
    h5: {
      fontFamily: '"Source Sans Pro", "Roboto", sans-serif',
      fontWeight: 600,
      fontSize: '1.5rem',
      color: '#0f172a',
      letterSpacing: '0.01em',
      lineHeight: 1.4,
    },
    h6: {
      fontFamily: '"Source Sans Pro", "Roboto", sans-serif',
      fontWeight: 600,
      fontSize: '1.25rem',
      color: '#0f172a',
      letterSpacing: '0.02em',
      lineHeight: 1.5,
    },
    subtitle1: {
      fontFamily: '"Source Sans Pro", "Roboto", sans-serif',
      fontWeight: 500,
      fontSize: '1.125rem',
      color: '#475569',
      lineHeight: 1.5,
    },
    subtitle2: {
      fontFamily: '"Source Sans Pro", "Roboto", sans-serif',
      fontWeight: 500,
      fontSize: '1rem',
      color: '#64748b',
      lineHeight: 1.5,
    },
    body1: {
      fontFamily: '"Source Sans Pro", "Roboto", sans-serif',
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.7,
      color: '#334155',
      letterSpacing: '0.01em',
    },
    body2: {
      fontFamily: '"Source Sans Pro", "Roboto", sans-serif',
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: '#64748b',
      letterSpacing: '0.01em',
    },
    button: {
      fontFamily: '"Source Sans Pro", "Roboto", sans-serif',
      fontWeight: 600,
      fontSize: '1rem',
      letterSpacing: '0.02em',
      textTransform: 'none' as const,
    },
    caption: {
      fontFamily: '"Source Sans Pro", "Roboto", sans-serif',
      fontWeight: 400,
      fontSize: '0.75rem',
      letterSpacing: '0.03em',
      color: '#64748b',
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 3px rgba(15, 23, 42, 0.06), 0px 1px 2px rgba(15, 23, 42, 0.04)',
    '0px 4px 6px rgba(15, 23, 42, 0.07), 0px 2px 4px rgba(15, 23, 42, 0.06)',
    '0px 10px 15px rgba(15, 23, 42, 0.08), 0px 4px 6px rgba(15, 23, 42, 0.07)',
    '0px 20px 25px rgba(15, 23, 42, 0.1), 0px 10px 10px rgba(15, 23, 42, 0.08)',
    '0px 25px 50px rgba(15, 23, 42, 0.15), 0px 12px 15px rgba(15, 23, 42, 0.1)',
    '0px 30px 60px rgba(15, 23, 42, 0.18), 0px 15px 20px rgba(15, 23, 42, 0.12)',
    '0px 35px 70px rgba(15, 23, 42, 0.2), 0px 18px 25px rgba(15, 23, 42, 0.14)',
    '0px 40px 80px rgba(15, 23, 42, 0.22), 0px 20px 30px rgba(15, 23, 42, 0.16)',
    '0px 45px 90px rgba(15, 23, 42, 0.24), 0px 22px 35px rgba(15, 23, 42, 0.18)',
    '0px 50px 100px rgba(15, 23, 42, 0.26), 0px 25px 40px rgba(15, 23, 42, 0.2)',
    '0px 55px 110px rgba(15, 23, 42, 0.28), 0px 28px 45px rgba(15, 23, 42, 0.22)',
    '0px 60px 120px rgba(15, 23, 42, 0.3), 0px 30px 50px rgba(15, 23, 42, 0.24)',
    '0px 65px 130px rgba(15, 23, 42, 0.32), 0px 32px 55px rgba(15, 23, 42, 0.26)',
    '0px 70px 140px rgba(15, 23, 42, 0.34), 0px 35px 60px rgba(15, 23, 42, 0.28)',
    '0px 75px 150px rgba(15, 23, 42, 0.36), 0px 38px 65px rgba(15, 23, 42, 0.3)',
    '0px 80px 160px rgba(15, 23, 42, 0.38), 0px 40px 70px rgba(15, 23, 42, 0.32)',
    '0px 85px 170px rgba(15, 23, 42, 0.4), 0px 42px 75px rgba(15, 23, 42, 0.34)',
    '0px 90px 180px rgba(15, 23, 42, 0.42), 0px 45px 80px rgba(15, 23, 42, 0.36)',
    '0px 95px 190px rgba(15, 23, 42, 0.44), 0px 48px 85px rgba(15, 23, 42, 0.38)',
    '0px 100px 200px rgba(15, 23, 42, 0.46), 0px 50px 90px rgba(15, 23, 42, 0.4)',
    '0px 105px 210px rgba(15, 23, 42, 0.48), 0px 52px 95px rgba(15, 23, 42, 0.42)',
    '0px 110px 220px rgba(15, 23, 42, 0.5), 0px 55px 100px rgba(15, 23, 42, 0.44)',
    '0px 115px 230px rgba(15, 23, 42, 0.52), 0px 58px 105px rgba(15, 23, 42, 0.46)',
    '0px 120px 240px rgba(15, 23, 42, 0.54), 0px 60px 110px rgba(15, 23, 42, 0.48)'
  ],
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 16,
          boxShadow: '0px 4px 6px rgba(15, 23, 42, 0.07), 0px 2px 4px rgba(15, 23, 42, 0.06)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 20px 25px rgba(15, 23, 42, 0.1), 0px 10px 10px rgba(15, 23, 42, 0.08)',
            borderColor: '#cbd5e1',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '12px 24px',
          fontSize: '0.875rem',
          fontWeight: 600,
          textTransform: 'none',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: 'none',
          letterSpacing: '0.025em',
        },
        contained: {
          backgroundColor: '#0f172a',
          color: '#ffffff',
          boxShadow: '0px 4px 6px rgba(15, 23, 42, 0.07), 0px 2px 4px rgba(15, 23, 42, 0.06)',
          '&:hover': {
            backgroundColor: '#1e293b',
            transform: 'translateY(-1px)',
            boxShadow: '0px 10px 15px rgba(15, 23, 42, 0.08), 0px 4px 6px rgba(15, 23, 42, 0.07)',
          },
          '&:active': {
            transform: 'translateY(0px)',
          },
        },
        outlined: {
          borderColor: '#0f172a',
          color: '#0f172a',
          backgroundColor: '#ffffff',
          borderWidth: 2,
          '&:hover': {
            backgroundColor: '#f8fafc',
            borderColor: '#0f172a',
            transform: 'translateY(-1px)',
            boxShadow: '0px 4px 6px rgba(15, 23, 42, 0.07), 0px 2px 4px rgba(15, 23, 42, 0.06)',
          },
        },
        text: {
          color: '#0f172a',
          '&:hover': {
            backgroundColor: '#f8fafc',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#ffffff',
            borderRadius: 12,
            fontSize: '0.875rem',
            '& fieldset': {
              borderColor: '#e2e8f0',
              borderWidth: 1,
            },
            '&:hover fieldset': {
              borderColor: '#cbd5e1',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#0f172a',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 8,
          fontSize: '0.75rem',
          height: 28,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #e2e8f0',
          boxShadow: '0px 1px 3px rgba(15, 23, 42, 0.06), 0px 1px 2px rgba(15, 23, 42, 0.04)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          borderRadius: 12,
          border: '1px solid #e2e8f0',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontSize: '0.875rem',
        },
      },
    },
  },
});

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  return user ? <>{children}</> : <Navigate to="/auth" />;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <AuthProvider>
          <Router>              <Box sx={{ 
                position: 'relative',
                display: 'flex', 
                flexDirection: 'column', 
                minHeight: '100vh',
                backgroundColor: 'transparent',
              }}>
              <AnimatedBackground />
              <Navigation />
              <Box sx={{ flex: 1, position: 'relative', zIndex: 1 }}>
                <Routes>
                  <Route path="/" element={<HomeRedirect />} />
                  <Route path="/debug" element={<ReservationDebugger />} />
                  <Route path="/debug-appointment" element={<DebugNewAppointment />} />
                  <Route path="/simple-appointment" element={<SimpleNewAppointment />} />
                  <Route path="/auth" element={<AuthForm />} />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <DashboardRouter />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute>
                        <AdminPanel />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/hairdresser" 
                    element={
                      <ProtectedRoute>
                        <HairdresserPanel />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/debug/reservations" 
                    element={
                      <ProtectedRoute>
                        <ReservationDebugger />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/debug/simple-new-appointment" 
                    element={
                      <ProtectedRoute>
                        <SimpleNewAppointment />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/debug/new-appointment" 
                    element={
                      <ProtectedRoute>
                        <DebugNewAppointment />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </Box>
              <Footer />
            </Box>
          </Router>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
