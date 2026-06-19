import { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

// Formulario controlado para que el usuario autenticado cambie su propia contraseña.
export default function CambiarContraseña() {
  const { token } = useContext(AuthContext);
  const [contraseñaActual, setContraseñaActual] = useState('');
  const [nuevaContraseña, setNuevaContraseña] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // PUT /usuarios/password envia el body con contraseñaActual y nuevaContraseña.
      await axios.put(
        'http://localhost:3000/usuarios/password',
        { contraseñaActual, nuevaContraseña },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensaje('Contraseña actualizada correctamente');
      setContraseñaActual('');
      setNuevaContraseña('');
    } catch (err: any) {
      setMensaje(err.response?.data?.error || 'Error al cambiar contraseña');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Cambiar contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Contraseña actual"
          value={contraseñaActual}
          onChange={(e) => setContraseñaActual(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={nuevaContraseña}
          onChange={(e) => setNuevaContraseña(e.target.value)}
          required
        /><br />
        <button type="submit">Actualizar</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}
