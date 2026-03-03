import type React from 'react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import '../AuthPage/AuthPage.css';
import axios from 'axios';

export const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password should be at least 8 characters');
      return;
    }

    if (confirmPassword !== password) {
      setError('Passwords do not match');
      return;
    }

    if (name.length < 2) {
      setError('Name should not be shorter than 2 characters');
      return;
    }

    if (name.length > 20) {
      setError('Name should not be longer than 20 characters');
      return;
    }

    setIsLoading(true);

    try {
      await register(email, password, name);
      navigate(location.state?.from?.pathname ?? '/');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error ?? 'Something went wrong');
      } else {
        setError('Something went wrong');
      }
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
              <button type="button" className="delete" onClick={() => setError('')}></button>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label has-text-grey" htmlFor="email">
                Email
              </label>
              <div className="control has-icons-left">
                <input
                  id="email"
                  className="input"
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
              <label className="label has-text-grey" htmlFor="password">
                Password
              </label>
              <div className="control has-icons-left">
                <input
                  id="password"
                  className="input"
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
              <label className="label has-text-grey" htmlFor="confirmPassword">
                Confirm password
              </label>
              <div className="control has-icons-left">
                <input
                  id="confirmPassword"
                  className="input"
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

            <div className="field">
              <label className="label has-text-grey" htmlFor="text">
                Enter your name
              </label>
              <div className="control has-icons-left">
                <input
                  id="text"
                  className="input"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-user"></i>
                </span>
              </div>
            </div>

            <button
              type="submit"
              className={`button is-primary is-fullwidth is-large mb-4 ${isLoading ? 'is-loading' : ''}`}
              disabled={isLoading || !email || !password || !confirmPassword}
            >
              Sign Up
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
