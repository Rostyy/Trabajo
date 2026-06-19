const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Controlador de login.
// Tecnologia usada: MySQL para buscar usuario, bcryptjs para comparar contraseña y JWT para generar token.
exports.login = (req, res) => {
  // req.body contiene lo que envio el formulario de Login desde React con Axios.
  const { email } = req.body;
  const contraseña = req.body['contraseña'];

  if (!email || !contraseña) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  // El ? es un parametro preparado: mysql2 reemplaza el valor sin concatenar strings manualmente.
  const sql = 'SELECT * FROM usuarios WHERE email = ?';
  db.query(sql, [email], async (err, resultados) => {
    // db.query es asincronico y responde por callback.
    if (err) return res.status(500).json({ error: 'Error en la base de datos' });

    if (resultados.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const usuario = resultados[0];

    // bcrypt.compare valida la contraseña ingresada contra el hash guardado.
    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!contraseñaValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // El token guarda datos minimos para futuras autorizaciones: id y rol.
    const token = jwt.sign(
      { id: usuario.id_usuario, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '4h' }
    );

    // Respuesta al frontend: AuthContext guardara token y usuario para el resto de la app.
    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  });
};
