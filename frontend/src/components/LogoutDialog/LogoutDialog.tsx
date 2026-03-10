import type React from 'react';
import './LogoutDialog.css';

type Props = {
  onConfirm: () => void;
  onCancel: () => void;
};

export const LogoutDialog: React.FC<Props> = ({ onConfirm, onCancel }) => {
  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog-box" onClick={e => e.stopPropagation()}>
        <div className="dialog-icon">
          <i className="fas fa-sign-out-alt" />
        </div>
        <h2 className="dialog-title">Log out</h2>
        <p className="dialog-message">Are you sure you want to log out?</p>
        <div className="dialog-actions">
          <button className="dialog-btn dialog-btn--cancel" onClick={onCancel}>
            No, stay
          </button>
          <button className="dialog-btn dialog-btn--confirm" onClick={onConfirm}>
            Yes, log out
          </button>
        </div>
      </div>
    </div>
  );
};
