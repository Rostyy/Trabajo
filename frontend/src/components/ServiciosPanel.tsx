import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import FormularioServicio from './FormularioServicio';
import type { Servicio, ServicioForm, Dispositivo, Usuario } from './FormularioServicio';

export default function ServiciosPanel() {
  const { token } = useContext(AuthContext);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [servicioSeleccionado, setServicioSeleccionado] = useState<Servicio | undefined>(undefined);

  const cargarDatos = async () => {
    try {
      const [servRes, dispRes, userRes] = await Promise.all([
        axios.get('http://localhost:3000/servicios', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:3000/dispositivos', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:3000/usuarios', { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setServicios(servRes.data);
      setDispositivos(dispRes.data);
      setUsuarios(userRes.data);
    } catch (err) {
      console.error('Error al cargar servicios, dispositivos o usuarios', err);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [token]);

  const obtenerDispositivo = (id: number) => {
    const d = dispositivos.find((d) => d.id_dispositivo === id);
    return d ? `${d.tipo} - ${d.marca} ${d.modelo}` : `ID ${id}`;
  };

  const obtenerUsuario = (id: number) => {
    const u = usuarios.find((u) => u.id_usuario === id);
    return u?.nombre || `ID ${id}`;
  };

  const guardarServicio = async (form: ServicioForm) => {
    try {
      if (servicioSeleccionado) {
        await axios.put(`http://localhost:3000/servicios/${servicioSeleccionado.id_servicio}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('http://localhost:3000/servicios', form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setMostrarModal(false);
      setServicioSeleccionado(undefined);
      cargarDatos();
    } catch (err) {
      alert('Error al guardar servicio');
    }
  };

  const eliminarServicio = async (id: number) => {
    if (!window.confirm('¿Eliminar este servicio?')) return;
    try {
      await axios.delete(`http://localhost:3000/servicios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      cargarDatos();
    } catch (err) {
      alert('Error al eliminar servicio');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>
        Servicios{' '}
        <button
          onClick={() => {
            setServicioSeleccionado(undefined);
            setMostrarModal(true);
          }}
          style={{ fontSize: '1.2rem' }}
        >
          ➕
        </button>
      </h2>

      <div className="cards-container">
        {servicios.map((s) => (
          <div key={s.id_servicio} className="card">
            <h3>{s.tipo.toUpperCase()} - {s.estado}</h3>
            <p><strong>Fecha:</strong> {new Date(s.fecha).toLocaleDateString('es-AR')}</p>
            <p><strong>Dispositivo:</strong> {obtenerDispositivo(s.id_dispositivo)}</p>
            <p><strong>Técnico:</strong> {obtenerUsuario(s.id_usuario)}</p>
            <p><strong>Descripción:</strong> {s.descripcion}</p>
            <div style={{ marginTop: '10px' }}>
              <button
                className="editar"
                onClick={() => {
                  setServicioSeleccionado(s);
                  setMostrarModal(true);
                }}
              >
                Editar
              </button>{' '}
              <button
                className="eliminar"
                onClick={() => eliminarServicio(s.id_servicio)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {mostrarModal && (
        <FormularioServicio
          servicioInicial={servicioSeleccionado}
          dispositivos={dispositivos}
          usuarios={usuarios}
          onGuardar={guardarServicio}
          onCancelar={() => {
            setMostrarModal(false);
            setServicioSeleccionado(undefined);
          }}
        />
      )}
    </div>
  );
}
