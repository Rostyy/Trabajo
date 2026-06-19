require('dotenv').config();

// server.js es el punto de arranque: carga variables .env, conecta MySQL y recien despues escucha requests.
const app = require('./app');
const { connectDb } = require('./config/db');

const PORT = process.env.PORT || 3000;

// La conexion es asincronica: connectDb recibe un callback que se ejecuta cuando MySQL ya esta listo.
connectDb(() => {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
});
