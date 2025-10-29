import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import FormularioDispositivo from './FormularioDispositivo';
import type { Dispositivo, DispositivoForm, Oficina } from './FormularioDispositivo';



export default function DispositivosPanel() {
  const { token } = useContext(AuthContext);
  const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);
  const [oficinas, setOficinas] = useState<Oficina[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [dispositivoSeleccionado, setDispositivoSeleccionado] = useState<Dispositivo | undefined>(undefined);

  const cargarDatos = async () => {
    try {
      const [dispRes, ofiRes] = await Promise.all([
        axios.get('http://localhost:3000/dispositivos', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('http://localhost:3000/oficinas', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setDispositivos(dispRes.data);
      setOficinas(ofiRes.data);
    } catch (err) {
      console.error('Error al cargar dispositivos u oficinas', err);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [token]);

  const obtenerOficina = (id_oficina: number) => {
    const oficina = oficinas.find((o) => o.id_oficina === id_oficina);
    return oficina ? `${oficina.direccion} (${oficina.ciudad})` : `ID ${id_oficina}`;
  };

  const guardarDispositivo = async (form: DispositivoForm) => {
    try {
      if (dispositivoSeleccionado) {
        await axios.put(`http://localhost:3000/dispositivos/${dispositivoSeleccionado.id_dispositivo}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('http://localhost:3000/dispositivos', form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setMostrarModal(false);
      setDispositivoSeleccionado(undefined);
      cargarDatos();
    } catch (err) {
      alert('Error al guardar dispositivo');
    }
  };

  const eliminarDispositivo = async (id_dispositivo: number) => {
    if (!window.confirm('¿Eliminar este dispositivo?')) return;
    try {
      await axios.delete(`http://localhost:3000/dispositivos/${id_dispositivo}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      cargarDatos();
    } catch (err) {
      alert('Error al eliminar dispositivo');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>
        Dispositivos{' '}
        <button
          onClick={() => {
            setDispositivoSeleccionado(undefined);
            setMostrarModal(true);
          }}
          style={{ fontSize: '1.2rem' }}
        >
          ➕
        </button>
      </h2>

      <div className="cards-container">
        {dispositivos.map((disp) => (
          <div key={disp.id_dispositivo} className="card">
            <h3>{disp.tipo} - {disp.marca} {disp.modelo}</h3>
            <p><strong>Ubicación:</strong> {obtenerOficina(disp.id_oficina)}</p>
            <p><strong>Estado:</strong> {disp.estado}</p>
            <div style={{ marginTop: '10px' }}>
              <button
                className="editar"
                onClick={() => {
                  setDispositivoSeleccionado(disp);
                  setMostrarModal(true);
                }}
              >
                Editar
              </button>{' '}
              <button className="eliminar" onClick={() => eliminarDispositivo(disp.id_dispositivo)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {mostrarModal && (
        <FormularioDispositivo
          dispositivoInicial={dispositivoSeleccionado}
          oficinas={oficinas}
          onGuardar={guardarDispositivo}
          onCancelar={() => {
            setMostrarModal(false);
            setDispositivoSeleccionado(undefined);
          }}
        />
      )}
    </div>
  );
}
