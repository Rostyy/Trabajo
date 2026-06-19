const db = require('../config/db');

// GET /clientes
exports.listarClientes = (req, res) => {
  // Consulta todos los clientes. El resultado vuelve al frontend como JSON y luego React lo renderiza con map().
  db.query('SELECT * FROM clientes', (err, resultado) => {
    if (err) return res.status(500).json({ error: 'Error al consultar clientes' });
    res.json(resultado);
  });
};

// POST /clientes
exports.crearCliente = (req, res) => {
  // req.body contiene los datos enviados por Axios desde el formulario controlado de React.
  const { nombre, cuit, contacto, email } = req.body;
  // Los ? son parametros preparados: evitan concatenar texto directo en SQL.
  const sql = 'INSERT INTO clientes (nombre, cuit, contacto, email) VALUES (?, ?, ?, ?)';
  db.query(sql, [nombre, cuit, contacto, email], (err, resultado) => {
    if (err) return res.status(500).json({ error: 'Error al crear cliente' });
    res.status(201).json({ mensaje: 'Cliente creado', id: resultado.insertId });
  });
};

// PUT /clientes/:id
exports.modificarCliente = (req, res) => {
  // req.params.id viene de la parte dinamica de la ruta /clientes/:id.
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
  // DELETE no necesita body: alcanza con el id de la URL para ubicar el registro.
  const { id } = req.params;
  db.query('DELETE FROM clientes WHERE id_cliente = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar cliente' });
    res.json({ mensaje: 'Cliente eliminado' });
  });
};
