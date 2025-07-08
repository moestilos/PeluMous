import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Home from './Home';

const HomeRedirect: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  // Si no hay usuario, mostrar la página de inicio
  if (!user) {
    return <Home />;
  }

  // Si es admin, redirigir al panel de admin
  if (user.rol === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  // Si es peluquero, redirigir al panel de peluquero
  if (user.rol === 'peluquero') {
    return <Navigate to="/hairdresser" replace />;
  }

  // Si es cliente, mostrar la página de inicio (que tiene funcionalidad de reservas)
  return <Home />;
};

export default HomeRedirect;
