import { Link } from 'react-router-dom';
import './AgeBanner.css';
import { useState } from 'react';

export const AgeBanner: React.FC = () => {
  const [isBannerOpen, setIsBannerOpen] = useState(getBannerState());

  return (
    isBannerOpen && (
      <div className="age-banner">
        <div className="age-banner__content">
          <span className="age-banner__icon">🔞</span>
          <p className="age-banner__text">Add your birth date in profile to unlock adult content</p>
          <Link to="/profile" className="age-banner__link button is-small is-warning is-light">
            Go to Profile
          </Link>
        </div>
        <button
          className="age-banner__close"
          aria-label="Close"
          type="button"
          onClick={() => {
            setIsBannerOpen(false);
            localStorage.setItem('isBannerOpen', 'false');
          }}
        >
          <i className="fas fa-times" />
        </button>
      </div>
    )
  );
};

function getBannerState (): boolean {
  return localStorage.getItem('isBannerOpen') !== 'false';
};
