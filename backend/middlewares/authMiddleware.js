const jwt = require('jsonwebtoken');

// Middleware de Express: una funcion que se ejecuta entre la request y el controlador.
// Tecnologia usada: JWT para autenticar usuarios sin guardar sesion en el servidor.
// Verifica token y guarda usuario en req.usuario
const authMiddleware = (req, res, next) => {
  // El frontend envia el token en el header Authorization: Bearer <token>.
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Falta token' });

  // split separa la palabra "Bearer" del token real.
  const token = authHeader.split(' ')[1];

  // jwt.verify valida firma y vencimiento. decoded trae datos como { id, rol }.
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.usuario = decoded; // { id, rol }
    next();
  });
};

// Middleware para permitir solo ciertos roles
const roleMiddleware = (...rolesPermitidos) => {
  return (req, res, next) => {
    // req.usuario existe porque antes se ejecuto authMiddleware.
    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ error: 'Acceso denegado: permiso insuficiente' });
    }
    next();
  };
};

module.exports = { authMiddleware, roleMiddleware };
