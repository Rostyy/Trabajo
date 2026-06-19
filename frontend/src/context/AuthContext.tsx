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

// Context permite compartir datos sin pasarlos manualmente por props en cada nivel.
export const AuthContext = createContext<AuthContextProps>({
  token: null,
  usuario: null,
  login: () => {},
  logout: () => {},
});

// AuthProvider es componente padre: recibe children por props y les entrega token, usuario y funciones.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // useState crea estado local del provider. localStorage conserva el token si se recarga la pagina.
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  // login lo llama Login.tsx cuando el backend responde correctamente.
  const login = (nuevoToken: string, datosUsuario: Usuario) => {
    localStorage.setItem('token', nuevoToken);
    setToken(nuevoToken);
    setUsuario(datosUsuario);
  };

  // logout borra estado en React y persistencia en localStorage.
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUsuario(null);
  };

  return (
    // value define que datos reciben los componentes hijos al usar useContext(AuthContext).
    <AuthContext.Provider value={{ token, usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
