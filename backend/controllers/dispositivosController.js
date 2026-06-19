const db = require('../config/db');

// GET /dispositivos
exports.listarDispositivos = (req, res) => {
  // JOIN triple: dispositivo -> oficina -> cliente. Asi una sola respuesta trae la ubicacion completa.
  const sql = `
    SELECT
      d.*,
      o.direccion AS oficina_direccion,
      o.ciudad AS oficina_ciudad,
      c.id_cliente,
      c.nombre AS cliente_nombre
    FROM dispositivos d
    JOIN oficinas o ON o.id_oficina = d.id_oficina
    JOIN clientes c ON c.id_cliente = o.id_cliente
    ORDER BY c.nombre, o.ciudad, o.direccion, d.tipo, d.marca, d.modelo
  `;

  db.query(sql, (err, resultados) => {
    if (err) return res.status(500).json({ error: 'Error al listar dispositivos' });
    res.json(resultados);
  });
};

// POST /dispositivos
exports.crearDispositivo = (req, res) => {
  // El frontend envia estos campos desde FormularioDispositivo; estado es la condicion del equipo.
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
  // PUT representa una actualizacion completa del dispositivo indicado por id.
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
  // Solo admin llega a este controlador porque la ruta aplica roleMiddleware('admin').
  const { id } = req.params;

  db.query('DELETE FROM dispositivos WHERE id_dispositivo = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar dispositivo' });
    res.json({ mensaje: 'Dispositivo eliminado' });
  });
};
