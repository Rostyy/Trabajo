const express = require('express');
const router = express.Router();
const serviciosController = require('../controllers/serviciosController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

// Técnicos y admins pueden ver, crear y modificar. Solo admin puede eliminar.
router.get('/', authMiddleware, roleMiddleware('admin', 'tecnico'), serviciosController.listarServicios);
router.post('/', authMiddleware, roleMiddleware('admin', 'tecnico'), serviciosController.crearServicio);
router.put('/:id', authMiddleware, roleMiddleware('admin', 'tecnico'), serviciosController.modificarServicio);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), serviciosController.eliminarServicio);

module.exports = router;
