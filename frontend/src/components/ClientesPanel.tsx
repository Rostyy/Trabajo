import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import FormularioCliente from './FormularioCliente';
import type { ClienteForm } from './FormularioCliente';


interface Cliente {
  id_cliente: number;
  nombre: string;
  cuit: string;
  contacto: string;
  email: string;
}

export default function ClientesPanel() {
  const { token } = useContext(AuthContext);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);

  const obtenerClientes = async () => {
    try {
      const res = await axios.get('http://localhost:3000/clientes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClientes(res.data);
    } catch (err) {
      console.error('Error al cargar clientes', err);
    }
  };

  useEffect(() => {
    obtenerClientes();
  }, [token]);

  const guardarCliente = async (form: ClienteForm) => {
    try {
      if (clienteSeleccionado) {
        await axios.put(`http://localhost:3000/clientes/${clienteSeleccionado.id_cliente}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('http://localhost:3000/clientes', form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setMostrarModal(false);
      setClienteSeleccionado(null);
      obtenerClientes();
    } catch (err) {
      alert('Error al guardar cliente');
    }
  };

  const eliminarCliente = async (id_cliente: number) => {
    const confirmar = window.confirm('¿Eliminar este cliente?');
    if (!confirmar) return;
    try {
      await axios.delete(`http://localhost:3000/clientes/${id_cliente}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      obtenerClientes();
    } catch (err) {
      alert('Error al eliminar cliente');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>
        Clientes{' '}
        <button
          onClick={() => {
            setClienteSeleccionado(null);
            setMostrarModal(true);
          }}
          style={{ fontSize: '1.2rem' }}
        >
          ➕
        </button>
      </h2>

      <div className="cards-container">
        {clientes.map((cliente) => (
          <div key={cliente.id_cliente} className="card">
            <h3>{cliente.nombre}</h3>
            <p><strong>CUIT:</strong> {cliente.cuit}</p>
            <p><strong>Contacto:</strong> {cliente.contacto}</p>
            <p><strong>Email:</strong> {cliente.email}</p>
            <div style={{ marginTop: '10px' }}>
              <button
                className="editar"
                onClick={() => {
                  setClienteSeleccionado(cliente);
                  setMostrarModal(true);
                }}
              >
                Editar
              </button>{' '}
              <button
                className="eliminar"
                onClick={() => eliminarCliente(cliente.id_cliente)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {mostrarModal && (
        <FormularioCliente
          clienteInicial={clienteSeleccionado ?? undefined}
          onGuardar={guardarCliente}
          onCancelar={() => {
            setMostrarModal(false);
            setClienteSeleccionado(null);
          }}
        />
      )}
    </div>
  );
}
