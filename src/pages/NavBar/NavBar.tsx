// Header.tsx (или Navbar.tsx)
import { Link } from 'react-router-dom';
import './NavBar.css';
import { useWatchListContext } from '../../contexts/WatchListContext';

export const NavBar: React.FC = () => {
  const { watchListMovieIds } = useWatchListContext();

  return (
    <nav className="navbar">
      <div className="navbar-menu">
        <Link to="/">HomePage</Link>
        <Link to="/login">AuthPage</Link>
        <div className="navbar-end">
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
        </div>
      </div>
    </nav>
  );
};
