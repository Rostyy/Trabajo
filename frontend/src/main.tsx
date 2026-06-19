import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Punto de entrada de React: conecta el componente App con el div #root de index.html.
ReactDOM.createRoot(document.getElementById('root')!).render(
  // StrictMode ayuda en desarrollo a detectar efectos secundarios y malas practicas.
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
