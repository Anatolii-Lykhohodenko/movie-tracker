import type React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const RequireAuth: React.FC = () => {
  const isAuth = false;

  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};
