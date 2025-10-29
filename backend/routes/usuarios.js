const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

router.put('/password', authMiddleware, usuariosController.cambiarContraseña);

// Solo admins pueden tocar usuarios
router.get('/', authMiddleware, roleMiddleware('admin'), usuariosController.listarUsuarios);
router.post('/', authMiddleware, roleMiddleware('admin'), usuariosController.crearUsuario);
router.put('/:id', authMiddleware, roleMiddleware('admin'), usuariosController.modificarUsuario);
router.put('/:id/password', authMiddleware, roleMiddleware('admin'), usuariosController.blanquearContraseña);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), usuariosController.eliminarUsuario);
router.put('/password', authMiddleware, usuariosController.cambiarContraseña);


module.exports = router;
