const db = require('../config/db');

// GET /oficinas
exports.listarOficinas = (req, res) => {
  // JOIN une oficinas con clientes para que el frontend pueda mostrar a que cliente pertenece cada oficina.
  const sql = `
    SELECT
      o.*,
      c.nombre AS cliente_nombre
    FROM oficinas o
    JOIN clientes c ON c.id_cliente = o.id_cliente
    ORDER BY c.nombre, o.ciudad, o.direccion
  `;

  db.query(sql, (err, resultados) => {
    if (err) return res.status(500).json({ error: 'Error al listar oficinas' });
    res.json(resultados);
  });
};

// POST /oficinas
exports.crearOficina = (req, res) => {
  // id_cliente es la clave foranea que relaciona oficina -> cliente.
  const { id_cliente, direccion, ciudad } = req.body;
  if (!id_cliente || !direccion || !ciudad) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  const sql = 'INSERT INTO oficinas (id_cliente, direccion, ciudad) VALUES (?, ?, ?)';
  db.query(sql, [id_cliente, direccion, ciudad], (err, resultado) => {
    if (err) return res.status(500).json({ error: 'Error al crear oficina' });
    res.status(201).json({ mensaje: 'Oficina creada', id: resultado.insertId });
  });
};

// PUT /oficinas/:id
exports.modificarOficina = (req, res) => {
  // Combina req.params para saber que oficina cambiar y req.body para los nuevos valores.
  const { id } = req.params;
  const { id_cliente, direccion, ciudad } = req.body;

  if (!id_cliente || !direccion || !ciudad) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  const sql = 'UPDATE oficinas SET id_cliente = ?, direccion = ?, ciudad = ? WHERE id_oficina = ?';
  db.query(sql, [id_cliente, direccion, ciudad, id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al modificar oficina' });
    res.json({ mensaje: 'Oficina modificada' });
  });
};

// DELETE /oficinas/:id
exports.eliminarOficina = (req, res) => {
  // La integridad referencial de MySQL controla que pasa con registros relacionados.
  const { id } = req.params;

  db.query('DELETE FROM oficinas WHERE id_oficina = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar oficina' });
    res.json({ mensaje: 'Oficina eliminada' });
  });
};
