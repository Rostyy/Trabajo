const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

// Solo admins pueden gestionar clientes
router.get('/', authMiddleware, roleMiddleware('admin'), clientesController.listarClientes);
router.post('/', authMiddleware, roleMiddleware('admin'), clientesController.crearCliente);
router.put('/:id', authMiddleware, roleMiddleware('admin'), clientesController.modificarCliente);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), clientesController.eliminarCliente);

module.exports = router;
