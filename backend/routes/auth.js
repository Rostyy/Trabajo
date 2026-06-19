const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login no lleva authMiddleware porque justamente genera el token inicial.
// El frontend envia email y password por req.body; el controlador devuelve token + usuario.
router.post('/login', authController.login);
module.exports = router;
