import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ClientesPanel from '../components/ClientesPanel';
import OficinasPanel from '../components/OficinasPanel';
import DispositivosPanel from '../components/DispositivosPanel';
import ServiciosPanel from '../components/ServiciosPanel';
import UsuariosPanel from '../components/UsuariosPanel';
import CambiarContraseña from '../components/CambiarContraseña';

// Panel es el componente padre de los modulos internos.
// Su estado "vista" decide que panel hijo se renderiza.
export default function Panel() {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [vista, setVista] = useState<string>('');

  const cerrarSesion = () => {
    const confirmar = window.confirm('¿Estás seguro de que querés cerrar sesión?');
    if (confirmar) {
      // logout limpia token/usuario del contexto y localStorage.
      logout();
      navigate('/');
    }
  };

  return (
    <div className="root">
      <h2>Bienvenido, {usuario?.nombre}</h2>
      <p>Rol: {usuario?.rol}</p>

      <div className="panel-header">
        {/* Cada boton cambia el estado "vista"; React vuelve a renderizar y muestra el componente elegido. */}
        <button onClick={() => setVista('clientes')}>Clientes</button>{' '}
        <button onClick={() => setVista('oficinas')}>Oficinas</button>{' '}
        <button onClick={() => setVista('dispositivos')}>Dispositivos</button>{' '}
        <button onClick={() => setVista('servicios')}>Servicios</button>{' '}
        <button onClick={() => setVista('usuarios')}>Usuarios</button>{' '}
        <button onClick={() => setVista('cambiarPassword')}>Cambiar contraseña</button>{' '}
        <button onClick={cerrarSesion}>Cerrar sesión</button>
      </div>

      {/* Renderizado condicional: se monta solo el modulo seleccionado. */}
      {vista === 'clientes' && <ClientesPanel />}
      {vista === 'oficinas' && <OficinasPanel />}
      {vista === 'dispositivos' && <DispositivosPanel />}
      {vista === 'servicios' && <ServiciosPanel />}
      {vista === 'usuarios' && <UsuariosPanel />}
      {vista === 'cambiarPassword' && <CambiarContraseña />}
    </div>
  );
}
