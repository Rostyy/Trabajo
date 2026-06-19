import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './views/Login';
import Panel from './views/Panel';
import RutaPrivada from './components/RutaPrivada';
import { AuthProvider } from './context/AuthContext';

// App define la arquitectura principal del frontend.
// AuthProvider envuelve toda la aplicacion para que cualquier componente pueda leer token/usuario.
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta publica: login. */}
          <Route path="/" element={<Login />} />
          {/* Ruta protegida: solo se muestra si RutaPrivada encuentra token en AuthContext. */}
          <Route
            path="/panel"
            element={
              <RutaPrivada>
                <Panel />
              </RutaPrivada>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
