const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

// Cambio de password propio: solo requiere estar autenticado; usa req.usuario.id del JWT.
router.put('/password', authMiddleware, usuariosController.cambiarContraseña);

// Recurso: usuarios. Solo admin puede listar, crear, editar, resetear password ajeno o eliminar.
router.get('/', authMiddleware, roleMiddleware('admin'), usuariosController.listarUsuarios);
router.post('/', authMiddleware, roleMiddleware('admin'), usuariosController.crearUsuario);
router.put('/:id', authMiddleware, roleMiddleware('admin'), usuariosController.modificarUsuario);
router.put('/:id/password', authMiddleware, roleMiddleware('admin'), usuariosController.blanquearContraseña);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), usuariosController.eliminarUsuario);

module.exports = router;
