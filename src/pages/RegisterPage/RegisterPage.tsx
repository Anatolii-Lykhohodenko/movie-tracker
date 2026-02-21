import type React from 'react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import '../AuthPage/AuthPage.css';

export const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (confirmPassword !== password) {
      setError('Passwords do not match');
      return
    }
    
    setIsLoading(true);

    try {
      await register(email, password);
      navigate(location.state?.from?.pathname ?? '/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Welcome</h1>
          <p className="auth-subtitle">Register to continue</p>

          {error && (
            <div className="notification is-danger">
              <button className="delete" onClick={() => setError('')}></button>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label has-text-grey">Email</label>
              <div className="control has-icons-left">
                <input
                  className={`input ${error ? 'is-danger' : ''}`}
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-envelope"></i>
                </span>
              </div>
            </div>

            <div className="field">
              <label className="label has-text-grey">Password</label>
              <div className="control has-icons-left">
                <input
                  className={`input ${error ? 'is-danger' : ''}`}
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>
              </div>
            </div>

            <div className="field">
              <label className="label has-text-grey">Confirm password</label>
              <div className="control has-icons-left">
                <input
                  className={`input ${error ? 'is-danger' : ''}`}
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>
              </div>
            </div>

            <button
              className="button is-primary is-fullwidth is-large mb-4"
              type="submit"
              disabled={isLoading || !email || !password || !confirmPassword}
            >
              {isLoading ? (
                <>
                  <span className="icon">
                    <i className="fas fa-spinner fa-spin"></i>
                  </span>
                  Signing up...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <Link to="/login" state={location.state} className="button is-text is-fullwidth">
            Already have an account?
          </Link>
        </div>
      </div>
    </div>
  );
};
