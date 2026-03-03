import type React from 'react';
import './ProfilePage.css';
import { useAuthContext } from '../../contexts/AuthContext';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import api from '../../services/api';
import axios from 'axios';

const MIN_AGE = 13;
const MAX_AGE = 120;

const today = new Date();

const maxBirthDate = new Date(today);
maxBirthDate.setFullYear(today.getFullYear() - MIN_AGE);

const minBirthDate = new Date(today);
minBirthDate.setFullYear(today.getFullYear() - MAX_AGE);

export const ProfilePage: React.FC = () => {
  const { user, setUser } = useAuthContext();

  const [isEditMode, setIsEditMode] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  if (!user) return null;

  const loggedSince = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const birthDateFormatted = user.birthDate
    ? new Date(user.birthDate).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
        day: 'numeric',
      })
    : null;

  const handleProfileSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileError('');

    if (user.birthDate && !birthDate) {
      setProfileError('Birth date cannot be removed once set');
      return;
    }

    if (name.length < 2) {
      setProfileError('Name should not be shorter than 2 characters');
      return;
    }

    if (name.length > 20) {
      setProfileError('Name should not be longer than 20 characters');
      return;
    }

    const isSameDate =
      new Date(birthDate).toDateString() === new Date(user.birthDate ?? '').toDateString();

    const dataToUpdate: Partial<{ name: string; birthDate: string }> = {};

    if (name !== user.name) {
      dataToUpdate.name = name;
    }

    if (!isSameDate) {
      dataToUpdate.birthDate = birthDate;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      setIsEditMode(false);
      return;
    }

    setIsProfileLoading(true);

    try {
      const response = await api.patch('/auth/me', dataToUpdate);
      setUser(response.data.user);
      setIsEditMode(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setProfileError(err.response?.data?.error ?? 'Something went wrong');
      } else {
        setProfileError('Something went wrong');
      }
    } finally {
      setIsProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setPasswordError('All password fields are required');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password should be at least 8 characters');
      return;
    }

    if (oldPassword === newPassword) {
      setPasswordError('New password cannot be equal to the current one');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New password and confirm password do not match');
      return;
    }

    setIsPasswordLoading(true);

    try {
      await api.patch('/auth/change-password', { oldPassword, newPassword });
      setPasswordSuccess(true);
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setShowOldPassword(false);
      setShowNewPassword(false);
      setShowConfirmNewPassword(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setPasswordError(err.response?.data?.error ?? 'Something went wrong');
      } else {
        setPasswordError('Something went wrong');
      }
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <i className="fas fa-user"></i>
          </div>
          <div className="profile-header-info">
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-email">{user.email}</p>
            {loggedSince && <p className="profile-since">Member since {loggedSince}</p>}
          </div>
        </div>

        {/* Personal Info Card */}
        <div className="profile-card">
          <div className="profile-card-header">
            <h2 className="profile-card-title">
              <span className="icon">
                <i className="fas fa-id-card"></i>
              </span>
              <span>Personal Info</span>
            </h2>
            {!isEditMode && (
              <button
                className="button profile-edit-btn"
                onClick={() => {
                  setName(user.name);
                  setBirthDate(user.birthDate ?? '');
                  setProfileError('');
                  setIsEditMode(true);
                }}
              >
                <span className="icon">
                  <i className="fas fa-pen"></i>
                </span>
                <span>Edit</span>
              </button>
            )}
          </div>

          {profileError && (
            <div className="notification profile-notification is-danger">
              <button className="delete" type="button" onClick={() => setProfileError('')} />
              {profileError}
            </div>
          )}

          {/* View mode */}
          {!isEditMode && (
            <div className="profile-info-grid">
              <div className="profile-info-item">
                <span className="profile-info-label">Name</span>
                <span className="profile-info-value">{user.name}</span>
              </div>
              <div className="profile-info-item">
                <span className="profile-info-label">Birth Date</span>
                <span className="profile-info-value">{birthDateFormatted || 'Not set yet'}</span>
              </div>
            </div>
          )}

          {/* Edit mode */}
          {isEditMode && (
            <form onSubmit={handleProfileSubmit}>
              <div className="field">
                <label className="profile-label" htmlFor="name">
                  Name
                </label>
                <div className="control has-icons-left">
                  <input
                    id="name"
                    className="input profile-input"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-user"></i>
                  </span>
                </div>
              </div>
              <div className="field">
                <label className="profile-label" htmlFor="birthDate">
                  Birth Date
                </label>
                <div className="control">
                  <DatePicker
                    id="birthDate"
                    selected={birthDate ? new Date(birthDate) : null}
                    onChange={(date: Date | null) => {
                      if (!date && user.birthDate) return;
                      setBirthDate(date?.toISOString() ?? '');
                    }}
                    isClearable={!user.birthDate}
                    dateFormat="MMMM d, yyyy"
                    placeholderText="Select birth date"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    minDate={minBirthDate}
                    maxDate={maxBirthDate}
                    className="input profile-input profile-input--date"
                    portalId="datepicker-portal"
                  />
                </div>
              </div>

              <div className="profile-edit-actions">
                <button
                  className={`button profile-save-btn ${isProfileLoading ? 'is-loading' : ''}`}
                  type="submit"
                  disabled={isProfileLoading}
                >
                  <span className="icon">
                    <i className="fas fa-check"></i>
                  </span>
                  <span>Save</span>
                </button>
                <button
                  className="button profile-cancel-btn"
                  type="button"
                  disabled={isProfileLoading}
                  onClick={() => {
                    setName('');
                    setBirthDate('');
                    setIsEditMode(false);
                    setProfileError('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Password Card */}
        <div className="profile-card">
          <div className="profile-card-header">
            <h2 className="profile-card-title">
              <span className="icon">
                <i className="fas fa-lock"></i>
              </span>
              <span>Change Password</span>
            </h2>
          </div>

          <form onSubmit={handlePasswordSubmit}>
            <div className="field">
              <label className="profile-label" htmlFor="currentPassword">
                Current Password
              </label>
              <div className="control has-icons-left has-icons-right">
                <input
                  id="currentPassword"
                  className="input profile-input"
                  type={showOldPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>
                <span
                  className="icon is-small is-right"
                  style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                  onClick={() => setShowOldPassword(prev => !prev)}
                >
                  <i className={`fas ${showOldPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </span>
              </div>
            </div>
            <div className="field">
              <label className="profile-label" htmlFor="newPassword">
                New Password
              </label>
              <div className="control has-icons-left has-icons-right">
                <input
                  id="newPassword"
                  className="input profile-input"
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>
                <span
                  className="icon is-small is-right"
                  style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                  onClick={() => setShowNewPassword(prev => !prev)}
                >
                  <i className={`fas ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </span>
              </div>
            </div>
            <div className="field">
              <label className="profile-label" htmlFor="confirmNewPassword">
                Confirm New Password
              </label>
              <div className="control has-icons-left  has-icons-right">
                <input
                  id="confirmNewPassword"
                  className="input profile-input"
                  type={showConfirmNewPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmNewPassword}
                  onChange={e => setConfirmNewPassword(e.target.value)}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>
                <span
                  className="icon is-small is-right"
                  style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                  onClick={() => setShowConfirmNewPassword(prev => !prev)}
                >
                  <i className={`fas ${showConfirmNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </span>
              </div>
            </div>

            {passwordError && (
              <div className="notification profile-notification is-danger">
                <button className="delete" type="button" onClick={() => setPasswordError('')} />
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="notification profile-notification is-success">
                <button
                  className="delete"
                  type="button"
                  onClick={() => setPasswordSuccess(false)}
                />
                Password updated successfully!
              </div>
            )}

            <button
              className={`button profile-save-btn ${isPasswordLoading ? 'is-loading' : ''}`}
              type="submit"
              disabled={isPasswordLoading}
            >
              <span className="icon">
                <i className="fas fa-key"></i>
              </span>
              <span>Update Password</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
