const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');
const clientesRoutes = require('./routes/clientes');
const oficinasRoutes = require('./routes/oficinas');
const dispositivosRoutes = require('./routes/dispositivos');
const serviciosRoutes = require('./routes/servicios');

const app = express();// Crear una instancia de Express
app.use(cors());
app.use(express.json());

app.use('/clientes', clientesRoutes);
app.use('/oficinas', oficinasRoutes);
app.use('/dispositivos', dispositivosRoutes);
app.use('/servicios', serviciosRoutes);


// Importar la ruta de usuarios
const usuariosRoutes = require('./routes/usuarios');
app.use('/usuarios', usuariosRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando 🚀');
});

const PORT = process.env.PORT || 3000;// Puerto del servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});


const authRoutes = require('./routes/auth');// Importar la ruta de autenticación
app.use('/auth', authRoutes);//ruta de autenticación

