import type React from 'react';
import './Loader.css';

interface Props {
  fullscreen?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const Loader: React.FC<Props> = ({ fullscreen = false, size = 'large' }) => {
  if (fullscreen) {
    return (
      <div className="loader-fullscreen">
        <button className={`button is-loading is-${size} is-ghost`}></button>
      </div>
    );
  }

  return (
    <div className="has-text-centered p-6">
      <button className={`button is-loading is-${size} is-ghost`}></button>
    </div>
  );
};
