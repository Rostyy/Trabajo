const db = require('../config/db');

// GET /servicios
exports.listarServicios = (req, res) => {
  // Regla de negocio: admin ve todos los servicios; tecnico ve solo los asignados a su id del JWT.
  const esTecnico = req.usuario?.rol === 'tecnico';
  const sql = esTecnico ? 'SELECT * FROM servicios WHERE id_usuario = ?' : 'SELECT * FROM servicios';
  const params = esTecnico ? [req.usuario.id] : [];

  db.query(sql, params, (err, resultados) => {
    if (err) return res.status(500).json({ error: 'Error al listar servicios' });
    res.json(resultados);
  });
};

// POST /servicios
exports.crearServicio = (req, res) => {
  // En servicios, req.body trae datos del formulario; si el usuario es tecnico se fuerza su propio id.
  const { id_dispositivo, fecha, tipo, descripcion } = req.body;
  const id_usuario = req.usuario?.rol === 'tecnico' ? req.usuario.id : req.body.id_usuario;
  const estado = req.body.estado === 'terminado' ? 'finalizado' : req.body.estado;

  // Validacion basica antes de consultar la base: evita registros incompletos.
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
  // El tecnico solo puede actualizar trabajos propios; eso se refuerza en el WHERE de la consulta.
  const { id } = req.params;
  const { id_dispositivo, fecha, tipo, descripcion } = req.body;
  const id_usuario = req.usuario?.rol === 'tecnico' ? req.usuario.id : req.body.id_usuario;
  const estado = req.body.estado === 'terminado' ? 'finalizado' : req.body.estado;

  if (!id_dispositivo || !id_usuario || !fecha || !tipo || !descripcion || !estado) {
    return res.status(400).json({ error: 'Faltan datos obligatorios del servicio' });
  }

  const esTecnico = req.usuario?.rol === 'tecnico';
  // Para tecnico se agrega AND id_usuario = ?; si intenta tocar un servicio ajeno, affectedRows queda en 0.
  const sql = esTecnico
    ? 'UPDATE servicios SET id_dispositivo = ?, id_usuario = ?, fecha = ?, tipo = ?, descripcion = ?, estado = ? WHERE id_servicio = ? AND id_usuario = ?'
    : 'UPDATE servicios SET id_dispositivo = ?, id_usuario = ?, fecha = ?, tipo = ?, descripcion = ?, estado = ? WHERE id_servicio = ?';
  const params = esTecnico
    ? [id_dispositivo, id_usuario, fecha, tipo, descripcion, estado, id, req.usuario.id]
    : [id_dispositivo, id_usuario, fecha, tipo, descripcion, estado, id];

  db.query(sql, params, (err, resultado) => {
    if (err) return res.status(500).json({ error: 'Error al modificar servicio' });
    if (esTecnico && resultado.affectedRows === 0) {
      return res.status(403).json({ error: 'No podés modificar un servicio asignado a otro usuario' });
    }
    res.json({ mensaje: 'Servicio modificado' });
  });
};

// DELETE /servicios/:id
exports.eliminarServicio = (req, res) => {
  // Borrado reservado a admin desde la ruta. El id llega por req.params.
  const { id } = req.params;

  db.query('DELETE FROM servicios WHERE id_servicio = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar servicio' });
    res.json({ mensaje: 'Servicio eliminado' });
  });
};
