import type React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';
import { Outlet, useLocation } from 'react-router-dom';
import { NavBar } from './pages/NavBar';
import { FilterSidebar } from './components/FilterSidebar';

export const App: React.FC = () => {
  const { pathname } = useLocation();
  const showFilter = ['/', '/watchlist'].includes(pathname);

  return (
    <div className="section">
      <NavBar />
      {showFilter && <FilterSidebar />}
      <Outlet />
    </div>
  );
};
