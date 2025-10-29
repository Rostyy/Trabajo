const express = require('express');
const router = express.Router();
const dispositivosController = require('../controllers/dispositivosController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

// Admin y técnico pueden acceder
router.get('/', authMiddleware, roleMiddleware('admin', 'tecnico'), dispositivosController.listarDispositivos);
router.post('/', authMiddleware, roleMiddleware('admin'), dispositivosController.crearDispositivo);
router.put('/:id', authMiddleware, roleMiddleware('admin', 'tecnico'), dispositivosController.modificarDispositivo);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), dispositivosController.eliminarDispositivo);

module.exports = router;
