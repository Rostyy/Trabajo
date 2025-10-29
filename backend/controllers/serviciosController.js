const db = require('../config/db');

// GET /servicios
exports.listarServicios = (req, res) => {
  db.query('SELECT * FROM servicios', (err, resultados) => {
    if (err) return res.status(500).json({ error: 'Error al listar servicios' });
    res.json(resultados);
  });
};

// POST /servicios
exports.crearServicio = (req, res) => {
  const { id_dispositivo, id_usuario, fecha, tipo, descripcion, estado } = req.body;

  if (!id_dispositivo || !id_usuario || !fecha || !tipo || !descripcion || !estado) {
    return res.status(400).json({ error: 'Faltan datos obligatorios del servicio' });
  }

  const sql = 'INSERT INTO servicios (id_dispositivo, id_usuario, fecha, tipo, descripcion, estado) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [id_dispositivo, id_usuario, fecha, tipo, descripcion, estado], (err, resultado) => {
    if (err) return res.status(500).json({ error: 'Error al crear servicio' });
    res.status(201).json({ mensaje: 'Servicio creado', id: resultado.insertId });
  });
};

// PUT /servicios/:id
exports.modificarServicio = (req, res) => {
  const { id } = req.params;
  const { id_dispositivo, id_usuario, fecha, tipo, descripcion, estado } = req.body;

  if (!id_dispositivo || !id_usuario || !fecha || !tipo || !descripcion || !estado) {
    return res.status(400).json({ error: 'Faltan datos obligatorios del servicio' });
  }

  const sql = 'UPDATE servicios SET id_dispositivo = ?, id_usuario = ?, fecha = ?, tipo = ?, descripcion = ?, estado = ? WHERE id_servicio = ?';
  db.query(sql, [id_dispositivo, id_usuario, fecha, tipo, descripcion, estado, id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al modificar servicio' });
    res.json({ mensaje: 'Servicio modificado' });
  });
};

// DELETE /servicios/:id
exports.eliminarServicio = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM servicios WHERE id_servicio = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar servicio' });
    res.json({ mensaje: 'Servicio eliminado' });
  });
};
