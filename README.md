# Sistema de Gestión para Peluquería

Una aplicación web completa para gestionar citas, usuarios y servicios de una peluquería.

## Características

- **Sistema de autenticación** con roles (cliente, peluquero, admin)
- **Gestión de citas** con disponibilidad en tiempo real
- **Catálogo de servicios** con precios y duración
- **Panel de administración** para gestionar usuarios y servicios
- **Interfaz moderna** con Material-UI
- **API RESTful** con Node.js y Express
- **Base de datos** MongoDB

## Tecnologías

### Backend
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT para autenticación
- bcryptjs para encriptación
- CORS habilitado

### Frontend
- React + TypeScript
- Material-UI para la interfaz
- React Router para navegación
- Axios para comunicación con API
- Context API para gestión de estado

## Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- MongoDB (local o Atlas)
- Git

### Instalación de MongoDB (Requerido)

**Opción 1: MongoDB Local (Recomendado para desarrollo)**

1. Descargar MongoDB Community Server desde: https://www.mongodb.com/try/download/community
2. Instalar siguiendo las instrucciones del instalador
3. Iniciar el servicio MongoDB:
   - Windows: El servicio se inicia automáticamente después de la instalación
   - macOS: `brew services start mongodb/brew/mongodb-community`
   - Linux: `sudo systemctl start mongod`

**Opción 2: MongoDB Atlas (Nube)**

1. Crear cuenta gratuita en https://www.mongodb.com/atlas
2. Crear un cluster gratuito
3. Obtener la cadena de conexión
4. Actualizar `MONGODB_URI` en el archivo `.env`

### Configuración del Backend

1. Navegar al directorio del backend:
```bash
cd backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
- Editar el archivo `.env` con tus configuraciones:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/peluqueria
JWT_SECRET=tu_jwt_secret_muy_seguro_aqui_12345
NODE_ENV=development
```

4. Compilar TypeScript:
```bash
npm run build
```

5. Poblar la base de datos con datos de ejemplo:
```bash
npm run seed
```

6. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

El backend estará corriendo en `http://localhost:5000`

### Configuración del Frontend

1. Navegar al directorio del frontend:
```bash
cd frontend
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor de desarrollo:
```bash
npm start
```

El frontend estará corriendo en `http://localhost:3000`

## Usuarios de Prueba

Después de ejecutar `npm run seed` en el backend, tendrás estos usuarios disponibles:

- **Admin**: admin@peluqueria.com / admin123
- **Peluquero 1**: maria@peluqueria.com / maria123
- **Peluquero 2**: juan@peluqueria.com / juan123
- **Cliente**: cliente@ejemplo.com / cliente123

## Funcionalidades por Rol

### Cliente
- Registrarse e iniciar sesión
- Ver servicios disponibles
- Reservar citas con peluqueros
- Ver y gestionar sus citas
- Cancelar citas

### Peluquero
- Ver citas asignadas
- Cambiar estado de citas (confirmada, completada, etc.)
- Ver información de clientes

### Administrador
- Gestionar todos los usuarios
- Gestionar servicios (crear, editar, desactivar)
- Ver todas las citas del sistema
- Acceso completo al sistema

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión

### Citas
- `GET /api/appointments` - Obtener citas (filtradas por rol)
- `POST /api/appointments` - Crear nueva cita
- `PUT /api/appointments/:id/status` - Actualizar estado de cita
- `DELETE /api/appointments/:id` - Eliminar cita

### Servicios
- `GET /api/services` - Obtener servicios activos
- `POST /api/services` - Crear servicio (solo admin)
- `PUT /api/services/:id` - Actualizar servicio (solo admin)
- `DELETE /api/services/:id` - Desactivar servicio (solo admin)

### Usuarios
- `GET /api/users/peluqueros` - Obtener lista de peluqueros
- `GET /api/users` - Obtener todos los usuarios (solo admin)

## Estructura del Proyecto

```
peluqueria/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.ts
│   ├── .env
│   ├── package.json
│   ├── tsconfig.json
│   └── seed.ts
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── App.tsx
│   │   └── index.tsx
│   └── package.json
└── README.md
```

## Desarrollo

### Scripts Disponibles

**Backend:**
- `npm run dev` - Iniciar en modo desarrollo
- `npm run build` - Compilar TypeScript
- `npm start` - Iniciar servidor de producción
- `npm run seed` - Poblar base de datos

**Frontend:**
- `npm start` - Iniciar en modo desarrollo
- `npm run build` - Compilar para producción
- `npm test` - Ejecutar tests

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Próximas Funcionalidades

- [ ] Sistema de notificaciones por email
- [ ] Calendario visual para reservas
- [ ] Sistema de comentarios y valoraciones
- [ ] Reportes y estadísticas
- [ ] Integración con sistemas de pago
- [ ] App móvil con React Native

## Soporte

Para reportar bugs o solicitar nuevas funcionalidades, por favor abre un issue en el repositorio.

### Verificar MongoDB

Para verificar que MongoDB esté corriendo:
```bash
# Conectar a MongoDB local
mongosh
# O usar mongo si mongosh no está disponible
mongo
```
