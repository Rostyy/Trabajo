import { useContext, type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function RutaPrivada({ children }: { children: JSX.Element }) {
  const { token } = useContext(AuthContext);

  return token ? children : <Navigate to="/" />;
}
