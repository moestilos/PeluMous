import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ClientDashboard from './ClientDashboard';
import Dashboard from './Dashboard';

const DashboardRouter: React.FC = () => {
  const { user } = useAuth();

  // Para clientes, usar el nuevo ClientDashboard
  if (user?.rol === 'cliente') {
    return <ClientDashboard />;
  }

  // Para otros roles, usar el Dashboard original
  return <Dashboard />;
};

export default DashboardRouter;