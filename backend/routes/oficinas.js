const express = require('express');
const router = express.Router();
const oficinasController = require('../controllers/oficinasController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

// Solo admin puede administrar oficinas
router.get('/', authMiddleware, roleMiddleware('admin'), oficinasController.listarOficinas);
router.post('/', authMiddleware, roleMiddleware('admin'), oficinasController.crearOficina);
router.put('/:id', authMiddleware, roleMiddleware('admin'), oficinasController.modificarOficina);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), oficinasController.eliminarOficina);

module.exports = router;
