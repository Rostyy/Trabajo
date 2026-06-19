import { useContext, type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// RutaPrivada recibe un componente hijo por props.
// Si hay token lo renderiza; si no hay token redirige al login.
export default function RutaPrivada({ children }: { children: JSX.Element }) {
  const { token } = useContext(AuthContext);

  return token ? children : <Navigate to="/" />;
}
