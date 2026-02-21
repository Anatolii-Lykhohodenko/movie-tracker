import { useCallback, useEffect, useState } from "react";
import type { AuthContextType, User } from "../types/auth";

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
    throw new Error('Email and password required');
  }

  await new Promise(r => setTimeout(r, 1000));

  const mockToken = `mock-jwt-${Date.now()}`;
  const mockUser: User = { id: '1', email };

  setToken(mockToken);
  setUser(mockUser);
}, []);

const logout = useCallback(() => {
  setUser(null);
  setToken(null);
}, []);

const register = useCallback(
  async (email: string, password: string) => {
    await login(email, password);
  },
  [login],
);


  return {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    login,
    logout,
    register,
  };
};

const getUser = (): User | null=> {
  try {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to parse user:', error);
    return null;
  }
};

const getToken = (): string | null=> {
  try {
    const saved = localStorage.getItem('token');
    return saved || null;
  } catch (error) {
    console.error('Failed to parse token:', error);
    return null;
  }
};