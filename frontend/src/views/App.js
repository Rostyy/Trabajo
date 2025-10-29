import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './views/Login';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          {/* Acá podés agregar rutas protegidas más adelante */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
