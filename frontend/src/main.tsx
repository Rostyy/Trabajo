import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx'; // o .tsx si no tenés configuración estricta
import './index.css'; // opcional

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
