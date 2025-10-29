const db = require('../config/db');

// GET /dispositivos
exports.listarDispositivos = (req, res) => {
  db.query('SELECT * FROM dispositivos', (err, resultados) => {
    if (err) return res.status(500).json({ error: 'Error al listar dispositivos' });
    res.json(resultados);
  });
};

// POST /dispositivos
exports.crearDispositivo = (req, res) => {
  const { id_oficina, tipo, marca, modelo, estado } = req.body;

  if (!id_oficina || !tipo || !marca || !modelo || !estado) {
    return res.status(400).json({ error: 'Faltan datos del dispositivo' });
  }

  const sql = 'INSERT INTO dispositivos (id_oficina, tipo, marca, modelo, estado) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [id_oficina, tipo, marca, modelo, estado], (err, resultado) => {
    if (err) return res.status(500).json({ error: 'Error al crear dispositivo' });
    res.status(201).json({ mensaje: 'Dispositivo creado', id: resultado.insertId });
  });
};

// PUT /dispositivos/:id
exports.modificarDispositivo = (req, res) => {
  const { id } = req.params;
  const { id_oficina, tipo, marca, modelo, estado } = req.body;

  if (!id_oficina || !tipo || !marca || !modelo || !estado) {
    return res.status(400).json({ error: 'Faltan datos del dispositivo' });
  }

  const sql = 'UPDATE dispositivos SET id_oficina = ?, tipo = ?, marca = ?, modelo = ?, estado = ? WHERE id_dispositivo = ?';
  db.query(sql, [id_oficina, tipo, marca, modelo, estado, id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al modificar dispositivo' });
    res.json({ mensaje: 'Dispositivo modificado' });
  });
};

// DELETE /dispositivos/:id
exports.eliminarDispositivo = (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM dispositivos WHERE id_dispositivo = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar dispositivo' });
    res.json({ mensaje: 'Dispositivo eliminado' });
  });
};
