import React from 'react';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import './styles/modern-styles.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './components/Notifications/NotificationProvider';
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Layout/Footer';
import AuthForm from './components/Auth/AuthForm';
import Dashboard from './components/Dashboard/Dashboard';
import HomeRedirect from './components/Home/HomeRedirect';
import AdminPanel from './components/Admin/AdminPanel';
import HairdresserPanel from './components/Hairdresser/HairdresserPanel';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a1a2e',
      dark: '#16213e',
      light: '#0f4c75',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#e94560',
      dark: '#c73650',
      light: '#f35d6f',
      contrastText: '#ffffff',
    },
    background: {
      default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      paper: 'rgba(255, 255, 255, 0.95)',
    },
    text: {
      primary: '#1a1a2e',
      secondary: '#666666',
    },
    error: {
      main: '#e94560',
      light: '#ff6b7a',
      dark: '#c73650',
    },
    warning: {
      main: '#f0932b',
      light: '#ffbe76',
      dark: '#eb4d4b',
    },
    success: {
      main: '#6c5ce7',
      light: '#a29bfe',
      dark: '#5f27cd',
    },
    info: {
      main: '#00cec9',
      light: '#81ecec',
      dark: '#00b894',
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
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '3.5rem',
      color: '#1a1a2e',
      letterSpacing: '-0.025em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.5rem',
      color: '#1a1a2e',
      letterSpacing: '-0.025em',
    },
    h3: {
      fontWeight: 700,
      fontSize: '2rem',
      color: '#1a1a2e',
      letterSpacing: '-0.025em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.75rem',
      color: '#1a1a2e',
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
      color: '#1a1a2e',
      letterSpacing: '-0.02em',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
      color: '#1a1a2e',
      letterSpacing: '-0.02em',
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: '1.125rem',
      color: '#475569',
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '1rem',
      color: '#475569',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#334155',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: '#475569',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.875rem',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0px 2px 8px rgba(26, 26, 46, 0.08)',
    '0px 4px 16px rgba(26, 26, 46, 0.10)',
    '0px 8px 24px rgba(26, 26, 46, 0.12)',
    '0px 12px 32px rgba(26, 26, 46, 0.14)',
    '0px 16px 40px rgba(26, 26, 46, 0.16)',
    '0px 20px 48px rgba(26, 26, 46, 0.18)',
    '0px 24px 56px rgba(26, 26, 46, 0.20)',
    '0px 28px 64px rgba(26, 26, 46, 0.22)',
    '0px 32px 72px rgba(26, 26, 46, 0.24)',
    '0px 36px 80px rgba(26, 26, 46, 0.26)',
    '0px 40px 88px rgba(26, 26, 46, 0.28)',
    '0px 44px 96px rgba(26, 26, 46, 0.30)',
    '0px 48px 104px rgba(26, 26, 46, 0.32)',
    '0px 52px 112px rgba(26, 26, 46, 0.34)',
    '0px 56px 120px rgba(26, 26, 46, 0.36)',
    '0px 60px 128px rgba(26, 26, 46, 0.38)',
    '0px 64px 136px rgba(26, 26, 46, 0.40)',
    '0px 68px 144px rgba(26, 26, 46, 0.42)',
    '0px 72px 152px rgba(26, 26, 46, 0.44)',
    '0px 76px 160px rgba(26, 26, 46, 0.46)',
    '0px 80px 168px rgba(26, 26, 46, 0.48)',
    '0px 84px 176px rgba(26, 26, 46, 0.50)',
    '0px 88px 184px rgba(26, 26, 46, 0.52)',
    '0px 92px 192px rgba(26, 26, 46, 0.54)'
  ],
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 20,
          boxShadow: '0 8px 32px 0 rgba(26, 26, 46, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 16px 48px 0 rgba(26, 26, 46, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          transition: 'all 0.2s ease-in-out',
          textTransform: 'none',
          fontWeight: 700,
          boxShadow: 'none',
        },
        contained: {
          backgroundColor: '#000000',
          border: '2px solid #000000',
          boxShadow: '4px 4px 0px #333333',
          '&:hover': {
            backgroundColor: '#000000',
            transform: 'translate(-2px, -2px)',
            boxShadow: '6px 6px 0px #333333',
          },
        },
        outlined: {
          border: '2px solid #000000',
          backgroundColor: '#ffffff',
          boxShadow: '4px 4px 0px #000000',
          '&:hover': {
            border: '2px solid #000000',
            backgroundColor: '#f5f5f5',
            transform: 'translate(-2px, -2px)',
            boxShadow: '6px 6px 0px #000000',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 6,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: '1px solid #e2e8f0',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
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
          <Router>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              minHeight: '100vh',
              backgroundImage: 'url(/img/fondo.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed'
            }}>
              <Navigation />
              <Box sx={{ flex: 1 }}>
                <Routes>
                  <Route path="/" element={<HomeRedirect />} />
                  <Route path="/auth" element={<AuthForm />} />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <Dashboard />
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
