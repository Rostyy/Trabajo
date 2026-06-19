import { useEffect, useState } from 'react';

export interface DispositivoForm {
  id_oficina: number;
  tipo: string;
  marca: string;
  modelo: string;
  estado: string;
}

export interface Dispositivo {
  id_dispositivo: number;
  id_oficina: number;
  id_cliente?: number;
  tipo: string;
  marca: string;
  modelo: string;
  estado: string;
  oficina_direccion?: string;
  oficina_ciudad?: string;
  cliente_nombre?: string;
}

export interface Oficina {
  id_oficina: number;
  id_cliente?: number;
  direccion: string;
  ciudad: string;
  cliente_nombre?: string;
}

// Valores cerrados para evitar textos libres distintos en la base de datos.
const condicionesDispositivo = [
  { value: 'operativo', label: 'Operativo' },
  { value: 'con fallas', label: 'Con fallas' },
  { value: 'en reparación', label: 'En reparación' },
  { value: 'fuera de servicio', label: 'Fuera de servicio' },
  { value: 'de baja', label: 'De baja' },
];

interface Props {
  dispositivoInicial?: Dispositivo;
  // oficinas llega por props desde DispositivosPanel para llenar el select de ubicacion.
  oficinas: Oficina[];
  onGuardar: (data: DispositivoForm) => void;
  onCancelar: () => void;
}

export default function FormularioDispositivo({
  dispositivoInicial,
  oficinas,
  onGuardar,
  onCancelar,
}: Props) {
  // Formulario controlado: todos los inputs/selects leen y escriben este estado.
  const [form, setForm] = useState<DispositivoForm>({
    id_oficina: oficinas[0]?.id_oficina || 0,
    tipo: '',
    marca: '',
    modelo: '',
    estado: 'operativo',
  });

  useEffect(() => {
    // Si dispositivoInicial existe, se precarga para editar.
    if (dispositivoInicial) {
      const { id_oficina, tipo, marca, modelo, estado } = dispositivoInicial;
      setForm({ id_oficina, tipo, marca, modelo, estado });
    }
  }, [dispositivoInicial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Envia el objeto DispositivoForm al panel padre.
    onGuardar(form);
  };

  return (
    <div style={modalFondo}>
      <div style={modalContenido}>
        <h3>{dispositivoInicial ? 'Editar dispositivo' : 'Nuevo dispositivo'}</h3>
        <form onSubmit={handleSubmit}>
          <select
            value={form.id_oficina}
            onChange={(e) => setForm({ ...form, id_oficina: Number(e.target.value) })}
            required
          >
            {oficinas.map((of) => (
              <option key={of.id_oficina} value={of.id_oficina}>
                {of.cliente_nombre ? `${of.cliente_nombre} - ` : ''}{of.direccion} ({of.ciudad})
              </option>
            ))}
          </select><br />
          <input
            type="text"
            placeholder="Tipo"
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            required
          /><br />
          <input
            type="text"
            placeholder="Marca"
            value={form.marca}
            onChange={(e) => setForm({ ...form, marca: e.target.value })}
            required
          /><br />
          <input
            type="text"
            placeholder="Modelo"
            value={form.modelo}
            onChange={(e) => setForm({ ...form, modelo: e.target.value })}
            required
          /><br />
          <select
            value={form.estado}
            onChange={(e) => setForm({ ...form, estado: e.target.value })}
            required
          >
            {condicionesDispositivo.map((condicion) => (
              <option key={condicion.value} value={condicion.value}>
                {condicion.label}
              </option>
            ))}
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
  maxWidth: '400px',
};
