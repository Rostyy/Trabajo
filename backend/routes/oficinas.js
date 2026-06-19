const express = require('express');
const router = express.Router();
const oficinasController = require('../controllers/oficinasController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

// Recurso: oficinas. Una oficina pertenece a un cliente mediante id_cliente.
// Admin administra oficinas; tecnicos pueden listarlas para cargar dispositivos.
router.get('/', authMiddleware, roleMiddleware('admin', 'tecnico'), oficinasController.listarOficinas);
router.post('/', authMiddleware, roleMiddleware('admin'), oficinasController.crearOficina);
router.put('/:id', authMiddleware, roleMiddleware('admin'), oficinasController.modificarOficina);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), oficinasController.eliminarOficina);

module.exports = router;
