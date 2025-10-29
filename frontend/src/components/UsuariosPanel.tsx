import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import FormularioUsuario from './FormularioUsuario';
import type { Usuario, UsuarioForm } from './FormularioUsuario';

export default function UsuariosPanel() {
  const { token } = useContext(AuthContext);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<Usuario | undefined>(undefined);

  const cargarUsuarios = async () => {
    try {
      const res = await axios.get('http://localhost:3000/usuarios', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(res.data);
    } catch (err) {
      console.error('Error al cargar usuarios', err);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, [token]);

  const guardarUsuario = async (form: UsuarioForm) => {
    try {
      if (usuarioSeleccionado) {
        await axios.put(`http://localhost:3000/usuarios/${usuarioSeleccionado.id_usuario}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('http://localhost:3000/usuarios', form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setMostrarModal(false);
      setUsuarioSeleccionado(undefined);
      cargarUsuarios();
    } catch (err) {
      console.error(err);
      alert('Error al guardar usuario');
    }
  };

  const eliminarUsuario = async (id_usuario: number) => {
    if (!window.confirm('¿Eliminar este usuario?')) return;
    try {
      await axios.delete(`http://localhost:3000/usuarios/${id_usuario}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      cargarUsuarios();
    } catch (err) {
      console.error(err);
      alert('Error al eliminar usuario');
    }
  };

  const resetearPassword = async (id_usuario: number) => {
    try {
      const res = await axios.put(
        `http://localhost:3000/usuarios/${id_usuario}/password`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Contraseña temporal: ${res.data.password}`);
    } catch (err) {
      console.error(err);
      alert('Error al resetear contraseña');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>
        Usuarios{' '}
        <button
          onClick={() => {
            setUsuarioSeleccionado(undefined);
            setMostrarModal(true);
          }}
          style={{ fontSize: '1.2rem' }}
        >
          ➕
        </button>
      </h2>

      <div className="cards-container">
        {usuarios.map((u) => (
          <div key={u.id_usuario} className="card">
            <h3>{u.nombre}</h3>
            <p><strong>Email:</strong> {u.email}</p>
            <p><strong>Rol:</strong> {u.rol}</p>
            <div style={{ marginTop: '10px' }}>
              <button
                className="editar"
                onClick={() => {
                  setUsuarioSeleccionado(u);
                  setMostrarModal(true);
                }}
              >
                Editar
              </button>{' '}
              <button className="eliminar" onClick={() => eliminarUsuario(u.id_usuario)}>
                Eliminar
              </button>
              {' '}
              <button className="editar" onClick={() => resetearPassword(u.id_usuario)}>
                Resetear contraseña
              </button>
            </div>
          </div>
        ))}
      </div>

      {mostrarModal && (
        <FormularioUsuario
          usuarioInicial={usuarioSeleccionado}
          onGuardar={guardarUsuario}
          onCancelar={() => {
            setMostrarModal(false);
            setUsuarioSeleccionado(undefined);
          }}
        />
      )}
    </div>
  );
}
