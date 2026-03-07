import type React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';
import { Outlet, useLocation } from 'react-router-dom';
import { NavBar } from './pages/NavBar';
import { FilterSidebar } from './components/FilterSidebar';
import { AgeBanner } from './components/AgeBanner';
import { useAuthContext } from './contexts/AuthContext';

export const App: React.FC = () => {
  const { pathname } = useLocation();
  const showFilter = ['/', '/watchlist'].includes(pathname);
  const { user } = useAuthContext();

  return (
    <div className="section">
      <NavBar />
      {user && !user.birthDate && <AgeBanner /> }
      {showFilter && <FilterSidebar />}
      <Outlet />
    </div>
  );
};
