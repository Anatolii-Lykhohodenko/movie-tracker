import { useCallback, useEffect, useState } from 'react';
import type { AuthContextType, User } from '../types/auth';
import api from '../services/api';
import axios from 'axios';

export const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(getUser());
  const [token, setToken] = useState<string | null>(getToken());

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Email, password and name required');
    }

    try {
      const { data } = await api.post('/auth/login', { email, password });
      const { user, token }: { user: User; token: string } = data;

      setToken(token);
      setUser(user);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error ?? 'Login failed');
      }
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    if (!email || !password || !name) {
      throw new Error('Email, password and name are required');
    }

    try {
      const { data } = await api.post('/auth/register', { email, password, name });
      const { user, token }: { user: User; token: string } = data;

      setToken(token);
      setUser(user);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error ?? 'Login failed');
      }
      throw err;
    }
  }, []);

  return {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    login,
    logout,
    register,
    setUser,
  };
};

const getUser = (): User | null => {
  try {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    return null;
  }
};

const getToken = (): string | null => {
  try {
    const saved = localStorage.getItem('token');
    return saved || null;
  } catch (error) {
    return null;
  }
};
