// Header.tsx (или Navbar.tsx)
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './NavBar.css';
import { useWatchListContext } from '../../contexts/WatchListContext';
import { useAuthContext } from '../../contexts/AuthContext';

export const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const { watchListMovieIds } = useWatchListContext();
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const { isAuthenticated, logout } = useAuthContext();

  return (
    <nav className="navbar">
      <div className="navbar-menu">
        <Link to="/" className="navbar-brand">
          🎬 MOVIETON
        </Link>
        <div className="navbar-end">
          {isAuthenticated && (
            <button
              className="button is-light logout"
              title={'Log out'}
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              Log out
            </button>
          )}
          {!isAuthenticated && !isAuthPage && (
            <button
              className="button is-light"
              title={'Log in'}
              onClick={() => {
                navigate('/login');
              }}
            >
              Log in
            </button>
          )}
          {isAuthenticated && (
            <Link to="/watchlist" className="navbar-item">
              <span className="icon-text">
                <span className="icon">
                  <i className="fas fa-heart"></i>
                </span>
                <span className="is-hidden-mobile">Watchlist</span>
              </span>
              {watchListMovieIds.length > 0 && (
                <span className="tag is-danger is-rounded ml-2">{watchListMovieIds.length}</span>
              )}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
