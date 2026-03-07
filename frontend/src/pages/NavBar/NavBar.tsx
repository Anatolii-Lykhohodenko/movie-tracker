// Header.tsx (или Navbar.tsx)
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './NavBar.css';
import { useWatchListContext } from '../../contexts/WatchListContext';
import { useAuthContext } from '../../contexts/AuthContext';
import { useFilterContext } from '../../contexts/FilterContext';
import { useFavouritesContext } from '../../contexts/FavouritesContext';

export const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const { movieIds: watchListMovieIds } = useWatchListContext();
  const { movieIds: favouritesMovieIds } = useFavouritesContext();
  const { isAuthenticated, logout } = useAuthContext();
  const { toggleSidebar } = useFilterContext();
  const { resetFilters } = useFilterContext();
  const { pathname } = useLocation();
  const showFilter = ['/', '/watchlist'].includes(pathname);
  const isAuthPage = ['/login', '/register'].includes(pathname);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" onClick={resetFilters}>
          🎬 MOVIETON
        </Link>
        <div className="navbar-actions">
          {isAuthenticated && (
            <button
              className="button is-light logout"
              title={'Log out'}
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              <span className="icon">
                <i className="fas fa-sign-out-alt" />
              </span>
              <span className="is-hidden-mobile">Log out</span>
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
              <span className="icon">
                <i className="fas fa-sign-in-alt" />
              </span>
              <span className="is-hidden-mobile">Log in</span>
            </button>
          )}
          {isAuthenticated && (
            <Link to="/watchlist" className="navbar-item">
              <span className="icon-text">
                <span className="icon">
                  <i className="fas fa-bookmark"></i>
                </span>
                <span className="is-hidden-mobile">Watchlist</span>
              </span>
              {watchListMovieIds.length > 0 && (
                <span className="tag is-danger is-rounded ml-2">{watchListMovieIds.length}</span>
              )}
            </Link>
          )}
          {isAuthenticated && (
            <Link to="/favourites" className="navbar-item">
              <span className="icon-text">
                <span className="icon">
                  <i className="fas fa-heart"></i>
                </span>
                <span className="is-hidden-mobile">Favourites</span>
              </span>
              {favouritesMovieIds.length > 0 && (
                <span className="tag is-danger is-rounded ml-2">{favouritesMovieIds.length}</span>
              )}
            </Link>
          )}
          {showFilter && (
            <button className="button is-light sidebar-toggle" onClick={toggleSidebar}>
              <i className="fas fa-sliders-h" />
            </button>
          )}
          {isAuthenticated && (
            <Link to="/profile" className="navbar-item">
              <span className="icon">
                <i className="fas fa-user"></i>
              </span>
              <span className="is-hidden-mobile">Profile</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
