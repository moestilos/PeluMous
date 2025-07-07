import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LandingPage from './LandingPage';

const HomeRedirect: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  // Si no hay usuario, mostrar la nueva página de inicio
  if (!user) {
    return <LandingPage />;
  }

  // Si es admin, redirigir al panel de admin
  if (user.rol === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  // Si es peluquero, redirigir al panel de peluquero
  if (user.rol === 'peluquero') {
    return <Navigate to="/hairdresser" replace />;
  }

  // Si es cliente, mostrar la nueva página de inicio
  return <LandingPage />;
};

export default HomeRedirect;
