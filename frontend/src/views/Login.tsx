import { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Login usa un formulario controlado: cada input toma su valor desde useState.
export default function Login() {
  // login viene del contexto y permite guardar token/usuario en toda la app.
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Estados del formulario. Cada onChange actualiza estos valores.
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    // Evita que el navegador recargue la pagina al enviar el form.
    e.preventDefault();
    setError('');

    try {
      // Axios envia POST /auth/login con email y contraseña en el body.
      const res = await axios.post('http://localhost:3000/auth/login', {
        email,
        contraseña,
      });

      // La respuesta del backend trae token y usuario; se guardan en AuthContext.
      login(res.data.token, res.data.usuario);
      navigate('/panel');
    } catch (err: any) {
      // Si el backend responde error, se muestra en pantalla.
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)} //lo que hace que el formulario sea controlado
          required
        /><br />
        <input
          type="password"
          placeholder="Contraseña"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          required
        /><br />
        <button type="submit">Ingresar</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
