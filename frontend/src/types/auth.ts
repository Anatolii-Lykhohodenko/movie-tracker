export interface User {
  id: number;
  email: string;
  name: string;
  birthDate: string | null;
  createdAt: string;
  avatar: string | null;
  isAdult: boolean
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
  setUser: (user: User) => void
}