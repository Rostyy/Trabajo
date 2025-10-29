import { useEffect, useState } from 'react';

export interface Oficina {
  id_oficina: number;
  id_cliente: number;
  direccion: string;
  ciudad: string;
}

export interface OficinaForm {
  id_cliente: number;
  direccion: string;
  ciudad: string;
}


interface Cliente {
  id_cliente: number;
  nombre: string;
}

interface FormularioOficinaProps {
  oficinaInicial?: Oficina;
  clientes: Cliente[];
  onGuardar: (data: OficinaForm) => void;
  onCancelar: () => void;
}

export default function FormularioOficina({
  oficinaInicial,
  clientes,
  onGuardar,
  onCancelar,
}: FormularioOficinaProps) {
  const [form, setForm] = useState<OficinaForm>({
    id_cliente: clientes[0]?.id_cliente || 0,
    direccion: '',
    ciudad: '',
  });

  useEffect(() => {
    if (oficinaInicial) {
      const { id_cliente, direccion, ciudad } = oficinaInicial;
      setForm({ id_cliente, direccion, ciudad });
    }
  }, [oficinaInicial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar(form);
  };

  return (
    <div style={modalFondo}>
      <div style={modalContenido}>
        <h3>{oficinaInicial ? 'Editar oficina' : 'Nueva oficina'}</h3>
        <form onSubmit={handleSubmit}>
          <select
            value={form.id_cliente}
            onChange={(e) => setForm({ ...form, id_cliente: Number(e.target.value) })}
            required
          >
            {clientes.map((cliente) => (
              <option key={cliente.id_cliente} value={cliente.id_cliente}>
                {cliente.nombre}
              </option>
            ))}
          </select><br />
          <input
            type="text"
            placeholder="Dirección"
            value={form.direccion}
            onChange={(e) => setForm({ ...form, direccion: e.target.value })}
            required
          /><br />
          <input
            type="text"
            placeholder="Ciudad"
            value={form.ciudad}
            onChange={(e) => setForm({ ...form, ciudad: e.target.value })}
            required
          /><br /><br />
          <button type="submit" className="editar">Guardar</button>{' '}
          <button type="button" className="eliminar" onClick={onCancelar}>Cancelar</button>
        </form>
      </div>
    </div>
  );
}

const modalFondo: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContenido: React.CSSProperties = {
  background: '#fff',
  padding: '2rem',
  borderRadius: '10px',
  color: '#000',
  width: '90%',
  maxWidth: '400px',
};
