import { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function CambiarContraseña() {
  const { token } = useContext(AuthContext);
  const [contraseñaActual, setContraseñaActual] = useState('');
  const [nuevaContraseña, setNuevaContraseña] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(contraseñaActual,nuevaContraseña);
    try {
      await axios.put(
        'http://localhost:3000/usuarios/password',
        { contraseñaActual, nuevaContraseña },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMensaje('Contraseña actualizada correctamente');
      setContraseñaActual('');
      setNuevaContraseña('');
    } catch (err) {
      console.error(err);
      setMensaje('Error al actualizar la contraseña');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Cambiar contraseña</h3>
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
        <button type="submit" className="editar">Guardar</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

