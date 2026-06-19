import { useEffect, useState } from 'react';

export interface UsuarioForm {
  nombre: string;
  email: string;
  rol: string;
  password?: string;
}

export interface Usuario {
  id_usuario: number;
  nombre: string;
  email: string;
  rol: string;
}

interface Props {
  usuarioInicial?: Usuario;
  onGuardar: (data: UsuarioForm) => void;
  onCancelar: () => void;
}

// Formulario controlado para usuarios. Si usuarioInicial existe, funciona como edicion.
export default function FormularioUsuario({ usuarioInicial, onGuardar, onCancelar }: Props) {
  const [form, setForm] = useState<UsuarioForm>({
    nombre: '',
    email: '',
    rol: 'tecnico',
    password: '',
  });

  useEffect(() => {
    // Al editar, no se precarga password por seguridad; queda opcional.
    if (usuarioInicial) {
      const { nombre, email, rol } = usuarioInicial;
      setForm({ nombre, email, rol, password: '' });
    }
  }, [usuarioInicial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form };
    // Si password esta vacio en edicion, no se envia al backend.
    if (!data.password) {
      delete data.password;
    }
    onGuardar(data);
  };

  return (
    <div style={modalFondo}>
      <div style={modalContenido}>
        <h3>{usuarioInicial ? 'Editar usuario' : 'Nuevo usuario'}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
          /><br />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          /><br />
          <select
            value={form.rol}
            onChange={(e) => setForm({ ...form, rol: e.target.value })}
            required
          >
            <option value="admin">Admin</option>
            <option value="tecnico">Técnico</option>
            <option value="cliente">Cliente</option>
          </select><br />
          <input
            type="password"
            placeholder={usuarioInicial ? 'Nueva contraseña (opcional)' : 'Contraseña'}
            value={form.password || ''}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required={!usuarioInicial}
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
