import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, test } from 'vitest';
import RutaPrivada from './RutaPrivada';
import { AuthContext, type Usuario } from '../context/AuthContext';

// Test unitario de frontend: verifica el comportamiento de una ruta protegida segun el token.
const usuario: Usuario = {
  id: 1,
  nombre: 'Admin',
  email: 'admin@test.com',
  rol: 'admin',
};

function renderRutaPrivada(token: string | null) {
  return render(
    <AuthContext.Provider
      value={{
        token,
        usuario: token ? usuario : null,
        login: () => {},
        logout: () => {},
      }}
    >
      <MemoryRouter initialEntries={['/panel']}>
        <Routes>
          <Route
            path="/panel"
            element={
              <RutaPrivada>
                <div>Panel privado</div>
              </RutaPrivada>
            }
          />
          <Route path="/" element={<div>Login</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

describe('RutaPrivada', () => {
  test('redirige al login cuando no hay token', () => {
    renderRutaPrivada(null);

    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('muestra el contenido privado cuando hay token', () => {
    renderRutaPrivada('token-de-test');

    expect(screen.getByText('Panel privado')).toBeInTheDocument();
  });
});
