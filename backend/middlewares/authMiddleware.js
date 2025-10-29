const jwt = require('jsonwebtoken');

// Verifica token y guarda usuario en req.usuario
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Falta token' });

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.usuario = decoded; // { id, rol }
    next();
  });
};

// Middleware para permitir solo ciertos roles
const roleMiddleware = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ error: 'Acceso denegado: permiso insuficiente' });
    }
    next();
  };
};

module.exports = { authMiddleware, roleMiddleware };
