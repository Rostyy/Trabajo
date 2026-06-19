const express = require('express');
const router = express.Router();
const dispositivosController = require('../controllers/dispositivosController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

// Recurso: dispositivos/equipos. Un dispositivo pertenece a una oficina mediante id_oficina.
// Admin y tecnico pueden ver, crear y modificar; solo admin elimina.
router.get('/', authMiddleware, roleMiddleware('admin', 'tecnico'), dispositivosController.listarDispositivos);
router.post('/', authMiddleware, roleMiddleware('admin', 'tecnico'), dispositivosController.crearDispositivo);
router.put('/:id', authMiddleware, roleMiddleware('admin', 'tecnico'), dispositivosController.modificarDispositivo);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), dispositivosController.eliminarDispositivo);

module.exports = router;
