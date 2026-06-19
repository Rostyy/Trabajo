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

// ClientesPanel muestra la lista de clientes y, si el usuario es admin, permite CRUD.
// Props hacia hijos: envia clienteInicial, onGuardar y onCancelar a FormularioCliente.
export default function ClientesPanel() {
  const { token, usuario } = useContext(AuthContext);
  // Estado de datos: arreglo que se renderiza con map().
  const [clientes, setClientes] = useState<Cliente[]>([]);
  // Estado de UI: controla si el modal/formulario esta visible.
  const [mostrarModal, setMostrarModal] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);

  const obtenerClientes = async () => {
    try {
      // GET /clientes: pide datos al backend. El token viaja en headers para pasar authMiddleware.
      const res = await axios.get('http://localhost:3000/clientes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClientes(res.data);
    } catch (err) {
      console.error('Error al cargar clientes', err);
    }
  };

  useEffect(() => {
    // Ciclo de vida: se ejecuta al montar el componente y cada vez que cambia token.
    obtenerClientes();
  }, [token]);

  const guardarCliente = async (form: ClienteForm) => {
    try {
      if (clienteSeleccionado) {
        // PUT actualiza un registro existente; el id viaja en la URL.
        await axios.put(`http://localhost:3000/clientes/${clienteSeleccionado.id_cliente}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        // POST crea un registro nuevo; los datos viajan en el body.
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
      // DELETE elimina por id; no necesita enviar formulario completo.
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
        {usuario?.rol === 'admin' && (
        <button
          onClick={() => {
            setClienteSeleccionado(null);
            setMostrarModal(true);
          }}
          style={{ fontSize: '1.2rem' }}
        >
          ➕
        </button>
        )}
      </h2>

      <div className="cards-container">
        {clientes.map((cliente) => (
          // key ayuda a React a identificar cada tarjeta al renderizar listas.
          <div key={cliente.id_cliente} className="card">
            <h3>{cliente.nombre}</h3>
            <p><strong>CUIT:</strong> {cliente.cuit}</p>
            <p><strong>Contacto:</strong> {cliente.contacto}</p>
            <p><strong>Email:</strong> {cliente.email}</p>
            {usuario?.rol === 'admin' && (
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
            )}
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
