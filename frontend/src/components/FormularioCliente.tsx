import { useEffect, useState } from 'react';

export interface ClienteForm {
  nombre: string;
  cuit: string;
  contacto: string;
  email: string;
}

interface Cliente {
  id_cliente: number;
  nombre: string;
  cuit: string;
  contacto: string;
  email: string;
}

interface FormularioClienteProps {
  clienteInicial?: Cliente; // ← con `?`
  onGuardar: (data: ClienteForm) => void;
  onCancelar: () => void;
}


export default function FormularioCliente({
  clienteInicial,
  onGuardar,
  onCancelar,
}: FormularioClienteProps) {
  const [form, setForm] = useState<ClienteForm>({
    nombre: '',
    cuit: '',
    contacto: '',
    email: '',
  });

  useEffect(() => {
    if (clienteInicial) {
      const { nombre, cuit, contacto, email } = clienteInicial;
      setForm({ nombre, cuit, contacto, email });
    }
  }, [clienteInicial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar(form);
  };

  return (
    <div style={modalFondo}>
      <div style={modalContenido}>
        <h3>{clienteInicial ? 'Editar cliente' : 'Nuevo cliente'}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
          /><br />
          <input
            type="text"
            placeholder="CUIT"
            value={form.cuit}
            onChange={(e) => setForm({ ...form, cuit: e.target.value })}
            required
          /><br />
          <input
            type="text"
            placeholder="Contacto"
            value={form.contacto}
            onChange={(e) => setForm({ ...form, contacto: e.target.value })}
          /><br />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
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
