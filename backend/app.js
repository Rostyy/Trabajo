const express = require('express');
const cors = require('cors');

// Express organiza el backend en una aplicacion HTTP.
// Cada archivo de rutas recibe una URL base y decide que controlador ejecutar.
const clientesRoutes = require('./routes/clientes');
const oficinasRoutes = require('./routes/oficinas');
const dispositivosRoutes = require('./routes/dispositivos');
const serviciosRoutes = require('./routes/servicios');
const usuariosRoutes = require('./routes/usuarios');
const authRoutes = require('./routes/auth');

const app = express();

// cors permite que el frontend de Vite (puerto 5173) pueda llamar al backend (puerto 3000).
app.use(cors());

// express.json() interpreta el body JSON de requests POST/PUT y lo deja disponible en req.body.
app.use(express.json());

// Flujo general: request HTTP -> ruta -> middleware de auth/rol -> controlador -> base de datos -> res.json().
app.use('/clientes', clientesRoutes);
app.use('/oficinas', oficinasRoutes);
app.use('/dispositivos', dispositivosRoutes);
app.use('/servicios', serviciosRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/auth', authRoutes);

// Ruta simple para verificar que el servidor este levantado.
app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

module.exports = app;
