# Manual de desarrollo

## Backend

### Configuración y arranque
- **`server.js`** – Inicializa Express, aplica CORS/JSON, monta las rutas de entidades (`/clientes`, `/oficinas`, `/dispositivos`, `/servicios`, `/usuarios`, `/auth`) y levanta el servidor en el puerto configurado
- **`config/db.js`** – Crea y exporta la conexión MySQL usada por todos los controladores

### Middlewares
- **`middlewares/authMiddleware.js`** – Verifica el JWT recibido en la cabecera y expone el usuario en `req.usuario`; además, provee un middleware de roles para restringir acceso según permisos

### Controladores
Cada controlador implementa la lógica de negocio y es consumido por su ruta correspondiente:
- **`controllers/authController.js`** – Maneja el login: valida credenciales, genera token y devuelve datos del usuario autenticado
- **`controllers/clientesController.js`** – CRUD de clientes (listar, crear, modificar, eliminar) usando la tabla `clientes`
- **`controllers/oficinasController.js`** – CRUD de oficinas ligadas a clientes
- **`controllers/dispositivosController.js`** – CRUD de dispositivos pertenecientes a oficinas
- **`controllers/serviciosController.js`** – CRUD de servicios realizados sobre dispositivos por usuarios técnicos
- **`controllers/usuariosController.js`** – CRUD de usuarios y actualización de contraseñas, con hash mediante `bcrypt`

### Rutas
Enlazan cada endpoint HTTP con su controlador y aplican los middlewares de autenticación/roles:
- **`routes/auth.js`** – `POST /auth/login`
- **`routes/clientes.js`** – Endpoints protegidos solo para admin sobre `/clientes`
- **`routes/oficinas.js`** – Administración de oficinas (solo admin)
- **`routes/dispositivos.js`** – CRUD de dispositivos (admin y técnicos, según acción)
- **`routes/servicios.js`** – CRUD de servicios, con borrado exclusivo de admin
- **`routes/usuarios.js`** – Gestión de usuarios y actualización de contraseñas, limitada a administradores

---

## Frontend

### Infraestructura
- **`index.html`** – Documento raíz que monta la aplicación en `#root` y carga `main.tsx`
- **`vite.config.ts`** – Configuración de Vite con el plugin de React
- **`src/main.tsx`** – Punto de entrada que renderiza `<App />` en modo estricto y aplica estilos globales
- **`src/index.css`** – Estilos globales, botones, tarjetas y diseño responsivo
- **`src/vite-env.d.ts`** – Tipados de Vite para TypeScript

### Contexto de autenticación
- **`context/AuthContext.tsx`** – Define tipos de usuario, almacena token e información en estado, y expone funciones `login`/`logout` para todo el árbol de componentes

### Componentes de alto nivel
- **`App.tsx`** – Configura el enrutador; protege `/panel` mediante `RutaPrivada` y envuelve todo en `AuthProvider`
- **`views/Login.tsx`** – Formulario de autenticación que llama a `/auth/login` y guarda el token en el contexto
- **`components/RutaPrivada.tsx`** – Redirige al login si no hay token en `AuthContext`
- **`views/Panel.tsx`** – Escritorio principal; muestra botones para cada módulo, renderiza el panel correspondiente o el componente de cambio de contraseña y permite cerrar sesión

### Paneles y formularios
Cada panel consume endpoints específicos del backend (vía `axios`) y abre formularios modales reutilizables:

| Recurso | Panel | Formulario | Descripción |
|---------|-------|------------|-------------|
| Clientes | `ClientesPanel.tsx` – Lista y CRUD de clientes | `FormularioCliente.tsx` – Formulario modal para crear/editar clientes | Relacionados con oficinas y servicios |
| Oficinas | `OficinasPanel.tsx` – Gestiona oficinas y necesita listado de clientes | `FormularioOficina.tsx` – Selecciona cliente y datos de la oficina | Oficinas están vinculadas a clientes |
| Dispositivos | `DispositivosPanel.tsx` – Muestra dispositivos por oficina y permite CRUD | `FormularioDispositivo.tsx` – Asocia dispositivo a una oficina con su estado | Dispositivos dependen de oficinas |
| Servicios | `ServiciosPanel.tsx` – Lista servicios y relaciona dispositivos con técnicos | `FormularioServicio.tsx` – Selecciona dispositivo, técnico, tipo y estado del servicio | Servicios ligan dispositivos con usuarios |
| Usuarios | `UsuariosPanel.tsx` – CRUD de usuarios, opción de "resetear contraseña" que consume `/usuarios/{id}/password` | `FormularioUsuario.tsx` – Crea o edita usuarios; la contraseña es opcional en edición | Solo visible para administradores |
| Cambiar contraseña | `CambiarContraseña.tsx` – Permite que el usuario autenticado actualice su propia contraseña llamando a `/usuarios/password` | – | Integrado desde `Panel.tsx` |

---

## Relación general

1. **Autenticación:** `Login.tsx` obtiene el token y lo almacena en `AuthContext`. `RutaPrivada` usa este token para proteger rutas, y los paneles lo envían en los headers.
2. **Flujo de datos:** Los paneles consultan a las rutas del backend correspondientes (p.ej., `ClientesPanel` → `/clientes`) y muestran resultados en tarjetas.
3. **Modales reutilizables:** Formularios (`FormularioCliente`, `FormularioOficina`, etc.) reciben datos iniciales y callbacks (`onGuardar`, `onCancelar`) desde sus paneles padres.
4. **Navegación centralizada:** `Panel.tsx` sirve como hub; según la vista seleccionada, renderiza un panel distinto o el componente de cambio de contraseña.
