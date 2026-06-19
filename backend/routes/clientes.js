const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

// Recurso: clientes. La URL base se define en app.js como /clientes.
// Admin gestiona clientes; tecnicos pueden verlos como referencia.
// GET consulta datos; POST crea; PUT modifica por req.params.id; DELETE elimina por req.params.id.
router.get('/', authMiddleware, roleMiddleware('admin', 'tecnico'), clientesController.listarClientes);
router.post('/', authMiddleware, roleMiddleware('admin'), clientesController.crearCliente);
router.put('/:id', authMiddleware, roleMiddleware('admin'), clientesController.modificarCliente);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), clientesController.eliminarCliente);

module.exports = router;
