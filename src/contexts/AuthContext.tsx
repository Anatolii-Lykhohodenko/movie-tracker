import React, { createContext, useContext } from 'react';
import { useAuth } from '../hooks/useAutch';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

type Props = {
  children: React.ReactNode;
};
export const AuthProvider: React.FC<Props> = ({ children }) => {
  const authState = useAuth();
  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
