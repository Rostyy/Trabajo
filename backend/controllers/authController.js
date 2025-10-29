// Importa la configuración de la base de datos, bcrypt para comparar contraseñas y jwt para generar tokens
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Controlador para el login de usuarios
exports.login = (req, res) => {
  // Extrae el email y la contraseña del cuerpo de la petición
  const { email, contraseña } = req.body;

  // Verifica que ambos campos estén presentes
  if (!email || !contraseña) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  // Consulta SQL para buscar el usuario por email
  const sql = 'SELECT * FROM usuarios WHERE email = ?';
  db.query(sql, [email], async (err, resultados) => {
    // Si hay error en la base de datos, responde con error 500
    if (err) return res.status(500).json({ error: 'Error en la base de datos' });

    // Si no se encuentra el usuario, responde con error 401
    if (resultados.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    // Obtiene el usuario encontrado
    const usuario = resultados[0];
    // Compara la contraseña ingresada con la almacenada (encriptada)
    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);

    // Si la contraseña no es válida, responde con error 401
    if (!contraseñaValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Si la contraseña es válida, genera un token JWT con el id y rol del usuario
    const token = jwt.sign(
      { id: usuario.id_usuario, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '4h' }
    );

    // Responde con un mensaje de éxito, el token y algunos datos del usuario
    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  });
};
