const db = require('../config/db');

const bcrypt = require('bcryptjs');

exports.listarUsuarios = (req, res) => {
  const sql = 'SELECT id_usuario, nombre, email, rol FROM usuarios';
  db.query(sql, (err, resultados) => {
    if (err) return res.status(500).json({ error: 'Error en el servidor' });
    res.json(resultados);
  });
};

exports.crearUsuario = async (req, res) => {
  const { nombre, email, rol, contraseña, contrasena } = req.body;
  const pass = contraseña || contrasena;

  if (!nombre || !email || !pass || !rol) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    const contraseñaHasheada = await bcrypt.hash(pass, 10);

    const sql = 'INSERT INTO usuarios (nombre, email, contraseña, rol) VALUES (?, ?, ?, ?)';
    db.query(sql, [nombre, email, contraseñaHasheada, rol], (err, resultado) => {
      if (err) return res.status(500).json({ error: 'Error al crear usuario' });
      res.status(201).json({ mensaje: 'Usuario creado', id: resultado.insertId });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al hashear contraseña' });
  }
};

exports.modificarUsuario = (req, res) => {
  const { id } = req.params;
  const { nombre, email, rol } = req.body;

  if (!nombre || !email || !rol) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  const sql = 'UPDATE usuarios SET nombre = ?, email = ?, rol = ? WHERE id_usuario = ?';
  db.query(sql, [nombre, email, rol, id], (err, resultado) => {
    if (err) return res.status(500).json({ error: 'Error en la base de datos' });
    res.json({ mensaje: 'Usuario modificado correctamente' });
  });
};

exports.eliminarUsuario = (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM usuarios WHERE id_usuario = ?';
  db.query(sql, [id], (err, resultado) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar usuario' });
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  });
};


exports.blanquearContraseña = async (req, res) => {
  const { id } = req.params;

  const contraseñaTemporal = Math.random().toString(36).slice(-8);

  try {
    const contraseñaHasheada = await bcrypt.hash(contraseñaTemporal, 10);
    const sql = 'UPDATE usuarios SET contraseña = ? WHERE id_usuario = ?';
    db.query(sql, [contraseñaHasheada, id], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error al actualizar contraseña' });
      }
      res.json({ contraseñaTemporal });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al blanquear contraseña' });
  }
};


exports.cambiarContraseña = (req, res) => {
  const { contraseñaActual, nuevaContraseña } = req.body;
  const userId = req.usuario.id;

  if (!contraseñaActual || !nuevaContraseña) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  const sql = 'SELECT contraseña FROM usuarios WHERE id_usuario = ?';
  db.query(sql, [userId], async (err, resultados) => {
    if (err) return res.status(500).json({ error: 'Error en la base de datos' });
    if (resultados.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    const coincide = await bcrypt.compare(contraseñaActual, resultados[0].contraseña);
    if (!coincide) {
      return res.status(401).json({ error: 'Contraseña actual incorrecta' });
    }

    try {
      const nuevaHash = await bcrypt.hash(nuevaContraseña, 10);
      const updateSql = 'UPDATE usuarios SET contraseña = ? WHERE id_usuario = ?';
      db.query(updateSql, [nuevaHash, userId], (err) => {
        if (err) return res.status(500).json({ error: 'Error al actualizar contraseña' });
        res.json({ mensaje: 'Contraseña actualizada correctamente' });
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al hashear contraseña' });
    }
  });
};
