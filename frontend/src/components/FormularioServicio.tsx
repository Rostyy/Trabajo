import { useEffect, useState } from 'react';

export interface ServicioForm {
  id_dispositivo: number;
  id_usuario: number;
  fecha: string;
  tipo: 'mantenimiento' | 'reparación';
  descripcion: string;
  estado: 'pendiente' | 'en proceso' | 'finalizado';
}

export interface Servicio {
  id_servicio: number;
  id_dispositivo: number;
  id_usuario: number;
  fecha: string;
  tipo: 'mantenimiento' | 'reparación';
  descripcion: string;
  estado: 'pendiente' | 'en proceso' | 'finalizado';
}

export interface Dispositivo {
  id_dispositivo: number;
  tipo: string;
  marca: string;
  modelo: string;
}

export interface Usuario {
  id_usuario: number;
  nombre: string;
}


interface Props {
  servicioInicial?: Servicio;
  dispositivos: Dispositivo[];
  usuarios: Usuario[];
  onGuardar: (data: ServicioForm) => void;
  onCancelar: () => void;
}

export default function FormularioServicio({
  servicioInicial,
  dispositivos,
  usuarios,
  onGuardar,
  onCancelar,
}: Props) {
  const [form, setForm] = useState<ServicioForm>({
    id_dispositivo: dispositivos[0]?.id_dispositivo || 0,
    id_usuario: usuarios[0]?.id_usuario || 0,
    fecha: new Date().toISOString().slice(0, 10),
    tipo: 'mantenimiento',
    descripcion: '',
    estado: 'pendiente',
  });

  useEffect(() => {
    if (servicioInicial) {
      const { id_dispositivo, id_usuario, fecha, tipo, descripcion, estado } = servicioInicial;
      setForm({ id_dispositivo, id_usuario, fecha: fecha.slice(0, 10), tipo, descripcion, estado });
    }
  }, [servicioInicial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGuardar(form);
  };

  return (
    <div style={modalFondo}>
      <div style={modalContenido}>
        <h3>{servicioInicial ? 'Editar servicio' : 'Nuevo servicio'}</h3>
        <form onSubmit={handleSubmit}>
          <select
            value={form.id_dispositivo}
            onChange={(e) => setForm({ ...form, id_dispositivo: Number(e.target.value) })}
            required
          >
            {dispositivos.map((d) => (
              <option key={d.id_dispositivo} value={d.id_dispositivo}>
                {d.tipo} - {d.marca} {d.modelo}
              </option>
            ))}
          </select><br />
          <select
            value={form.id_usuario}
            onChange={(e) => setForm({ ...form, id_usuario: Number(e.target.value) })}
            required
          >
            {usuarios.map((u) => (
              <option key={u.id_usuario} value={u.id_usuario}>
                {u.nombre}
              </option>
            ))}
          </select><br />
          <input
            type="date"
            value={form.fecha}
            onChange={(e) => setForm({ ...form, fecha: e.target.value })}
            required
          /><br />
          <select
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value as ServicioForm['tipo'] })}
            required
          >
            <option value="mantenimiento">Mantenimiento</option>
            <option value="reparación">Reparación</option>
          </select><br />
          <textarea
            placeholder="Descripción"
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          /><br />
          <select
            value={form.estado}
            onChange={(e) => setForm({ ...form, estado: e.target.value as ServicioForm['estado'] })}
            required
          >
            <option value="pendiente">Pendiente</option>
            <option value="en proceso">En proceso</option>
            <option value="finalizado">Finalizado</option>
          </select><br /><br />
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
  maxWidth: '500px',
};
