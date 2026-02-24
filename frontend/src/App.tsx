import type React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';
import { Outlet } from 'react-router-dom';
import { NavBar } from './pages/NavBar';
import { FilterSidebar } from './components/FilterSidebar';

export const App: React.FC = () => {
  return (
    <div className="section">
      <NavBar />
      <FilterSidebar />
      <Outlet />
    </div>
  );
};
