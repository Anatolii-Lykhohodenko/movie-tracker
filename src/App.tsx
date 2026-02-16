import type React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';
import { Link, Outlet } from 'react-router-dom';

export const App: React.FC = () => {
  return (
    <>
      <Link to="/">HomePage</Link>
      <Link to="/login">AuthPage</Link>
      <Link to="/watchlist">WatchListPage</Link>
      <div className="section">
        <Outlet />
      </div>
    </>
  );
};
