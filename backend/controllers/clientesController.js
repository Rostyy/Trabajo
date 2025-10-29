const db = require('../config/db');

// GET /clientes
exports.listarClientes = (req, res) => {
  db.query('SELECT * FROM clientes', (err, resultado) => {
    if (err) return res.status(500).json({ error: 'Error al consultar clientes' });
    res.json(resultado);
  });
};

// POST /clientes
exports.crearCliente = (req, res) => {
  const { nombre, cuit, contacto, email } = req.body;
  const sql = 'INSERT INTO clientes (nombre, cuit, contacto, email) VALUES (?, ?, ?, ?)';
  db.query(sql, [nombre, cuit, contacto, email], (err, resultado) => {
    if (err) return res.status(500).json({ error: 'Error al crear cliente' });
    res.status(201).json({ mensaje: 'Cliente creado', id: resultado.insertId });
  });
};

// PUT /clientes/:id
exports.modificarCliente = (req, res) => {
  const { id } = req.params;
  const { nombre, cuit, contacto, email } = req.body;
  const sql = 'UPDATE clientes SET nombre = ?, cuit = ?, contacto = ?, email = ? WHERE id_cliente = ?';
  db.query(sql, [nombre, cuit, contacto, email, id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al modificar cliente' });
    res.json({ mensaje: 'Cliente modificado' });
  });
};

// DELETE /clientes/:id
exports.eliminarCliente = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM clientes WHERE id_cliente = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar cliente' });
    res.json({ mensaje: 'Cliente eliminado' });
  });
};
