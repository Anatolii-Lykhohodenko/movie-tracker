import type React from 'react';
import { Link } from 'react-router-dom';
import './EmptyState.css';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  actionLink,
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-content">
        {/* Icon */}
        <div className="empty-state-icon">
          <span className="icon is-large has-text-grey-light">
            <i className={`fas ${icon} fa-4x`}></i>
          </span>
        </div>

        <h2 className="title is-3 has-text-grey">{title}</h2>

        <p className="subtitle is-5 has-text-grey-light">{description}</p>

        {actionLabel && actionLink && (
          <div className="empty-state-action">
            <Link to={actionLink} className="button is-primary is-large">
              <span className="icon">
                <i className="fas fa-plus"></i>
              </span>
              <span>{actionLabel}</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
