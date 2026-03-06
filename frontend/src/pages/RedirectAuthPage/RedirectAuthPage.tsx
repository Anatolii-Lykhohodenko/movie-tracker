import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

export const RedirectAuthPage = () => {
  const { user } = useAuthContext();

  return user ? <Navigate to="/" replace /> : <Outlet />;
};
