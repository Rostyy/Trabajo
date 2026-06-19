# Base de datos local

Este proyecto usa MySQL/MariaDB. Para XAMPP:

1. Abrir XAMPP e iniciar `Apache` y `MySQL`.
2. Entrar a `http://localhost/phpmyadmin`.
3. Importar `backend/database/schema.sql`.
4. Verificar que `backend/.env` tenga estos valores:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=servicio_tecnico
PORT=3000
JWT_SECRET=miclaveultrasecreta123
```

Usuarios iniciales:

| Email | Password | Rol |
| --- | --- | --- |
| admin@local.test | admin123 | admin |
| tecnico@local.test | admin123 | tecnico |
