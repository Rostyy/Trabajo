import { createContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'admin' | 'tecnico' | 'cliente';
}

interface AuthContextProps {
  token: string | null;
  usuario: Usuario | null;
  login: (token: string, usuario: Usuario) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  token: null,
  usuario: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const login = (nuevoToken: string, datosUsuario: Usuario) => {
    localStorage.setItem('token', nuevoToken);
    setToken(nuevoToken);
    setUsuario(datosUsuario);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ token, usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
