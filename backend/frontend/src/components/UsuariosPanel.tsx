import React, { useState } from 'react';

const UsuariosPanel: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('');

  const token = localStorage.getItem('token');

  const crearUsuario = async () => {
    await fetch('/api/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nombre,
        email,
        contraseña: password,   // clave exacta
        rol,
      }),
    });
  };

  return (
    <div>
      {/* UI elements would go here */}
      <button onClick={crearUsuario}>Crear usuario</button>
    </div>
  );
};

export default UsuariosPanel;
