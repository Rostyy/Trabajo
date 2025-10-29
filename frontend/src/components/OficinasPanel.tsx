import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import FormularioOficina from './FormularioOficina';
import type { Oficina, OficinaForm } from './FormularioOficina';


interface Cliente {
  id_cliente: number;
  nombre: string;
}

export default function OficinasPanel() {
  const { token } = useContext(AuthContext);
  const [oficinas, setOficinas] = useState<Oficina[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [oficinaSeleccionada, setOficinaSeleccionada] = useState<Oficina | undefined>(undefined);

  const cargarDatos = async () => {
    try {
      const [ofRes, clRes] = await Promise.all([
        axios.get('http://localhost:3000/oficinas', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('http://localhost:3000/clientes', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setOficinas(ofRes.data);
      setClientes(clRes.data);
    } catch (err) {
      console.error('Error al cargar oficinas o clientes', err);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [token]);

  const obtenerNombreCliente = (id_cliente: number) => {
    const cliente = clientes.find((c) => c.id_cliente === id_cliente);
    return cliente ? cliente.nombre : `ID ${id_cliente}`;
  };

  const guardarOficina = async (form: OficinaForm) => {
    try {
      if (oficinaSeleccionada) {
        await axios.put(`http://localhost:3000/oficinas/${oficinaSeleccionada.id_oficina}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('http://localhost:3000/oficinas', form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setMostrarModal(false);
      setOficinaSeleccionada(undefined);
      cargarDatos();
    } catch (err) {
      alert('Error al guardar oficina');
    }
  };

  const eliminarOficina = async (id_oficina: number) => {
    if (!window.confirm('¿Eliminar esta oficina?')) return;
    try {
      await axios.delete(`http://localhost:3000/oficinas/${id_oficina}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      cargarDatos();
    } catch (err) {
      alert('Error al eliminar oficina');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>
        Oficinas{' '}
        <button
          onClick={() => {
            setOficinaSeleccionada(undefined);
            setMostrarModal(true);
          }}
          style={{ fontSize: '1.2rem' }}
        >
          ➕
        </button>
      </h2>

      <div className="cards-container">
        {oficinas.map((of) => (
          <div key={of.id_oficina} className="card">
            <h3>{obtenerNombreCliente(of.id_cliente)}</h3>
            <p><strong>Dirección:</strong> {of.direccion}</p>
            <p><strong>Ciudad:</strong> {of.ciudad}</p>
            <div style={{ marginTop: '10px' }}>
              <button
                className="editar"
                onClick={() => {
                  setOficinaSeleccionada(of);
                  setMostrarModal(true);
                }}
              >
                Editar
              </button>{' '}
              <button className="eliminar" onClick={() => eliminarOficina(of.id_oficina)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {mostrarModal && (
        <FormularioOficina
          oficinaInicial={oficinaSeleccionada}
          clientes={clientes}
          onGuardar={guardarOficina}
          onCancelar={() => {
            setMostrarModal(false);
            setOficinaSeleccionada(undefined);
          }}
        />
      )}
    </div>
  );
}
