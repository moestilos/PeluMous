# 💇‍♀️ PeluMous - Sistema de Gestión de Peluquería

Un sistema completo y profesional de gestión para peluquerías con interfaz web moderna, desarrollado con tecnologías de vanguardia.

## ✨ Características Principales

- 🎨 **Interfaz Moderna**: Diseño elegante con modo oscuro y animaciones fluidas
- 📅 **Sistema de Reservas**: Gestión completa de citas y servicios
- 👥 **Gestión de Usuarios**: Clientes, peluqueros y administradores
- 🔐 **Autenticación Segura**: Sistema de login con JWT tokens
- 📱 **Responsive Design**: Adaptado para todos los dispositivos
- ⚡ **Tiempo Real**: Actualizaciones instantáneas del estado de las citas
- 🎭 **Animaciones**: Transiciones suaves con Framer Motion

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** con TypeScript
- **Material-UI (MUI)** para componentes
- **Framer Motion** para animaciones
- **Axios** para peticiones HTTP
- **React Context** para gestión de estado

### Backend
- **Node.js** con Express
- **MongoDB** con Mongoose
- **JWT** para autenticación
- **bcryptjs** para encriptación
- **CORS** habilitado

### DevOps
- **Docker** para containerización
- **Docker Compose** para orquestación
- **Git** para control de versiones

## 🚀 Instalación y Configuración

### Prerequisitos
- Node.js 16+
- MongoDB 5+
- Docker (opcional)

### Instalación Manual

1. **Clonar el repositorio**
```bash
git clone git@github.com:moestilos/PeluMous.git
cd PeluMous
```

2. **Configurar Backend**
```bash
cd backend
npm install
cp .env.example .env
# Configurar variables de entorno en .env
npm run dev
```

3. **Configurar Frontend**
```bash
cd frontend
npm install
npm start
```

### Instalación con Docker

```bash
docker-compose up -d
```

## 📂 Estructura del Proyecto

```
PeluMous/
├── frontend/                 # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── contexts/        # Context providers
│   │   └── ...
│   └── package.json
├── backend/                  # API Node.js/Express
│   ├── src/
│   │   ├── controllers/     # Controladores
│   │   ├── models/          # Modelos MongoDB
│   │   ├── routes/          # Rutas API
│   │   └── middleware/      # Middlewares
│   └── package.json
├── docker-compose.yml       # Configuración Docker
└── README.md
```

## 🎯 Funcionalidades

### Para Clientes
- ✅ Registro y login
- ✅ Reservar citas
- ✅ Ver historial de citas
- ✅ Cancelar/modificar reservas
- ✅ Perfil personal

### Para Peluqueros
- ✅ Ver agenda personal
- ✅ Confirmar/rechazar citas
- ✅ Gestionar horarios
- ✅ Ver información de clientes

### Para Administradores
- ✅ Panel de control completo
- ✅ Gestión de usuarios
- ✅ Configuración de servicios
- ✅ Reportes y estadísticas

## 🔧 Variables de Entorno

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/peluqueria
JWT_SECRET=tu_secret_key_aqui
PORT=5000
NODE_ENV=development
```

### Frontend
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🎨 Capturas de Pantalla

### Dashboard Principal
Una interfaz moderna y elegante que muestra el resumen de citas y estadísticas importantes.

### Sistema de Reservas
Formulario intuitivo con selección de servicios, profesionales y horarios disponibles.

### Panel de Administración
Herramientas completas para gestionar usuarios, servicios y configuraciones del sistema.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 🐛 Reportar Bugs

Si encuentras algún bug, por favor abre un issue en GitHub con:
- Descripción del problema
- Pasos para reproducirlo
- Capturas de pantalla (si aplica)
- Información del navegador/sistema

## 📋 Roadmap

- [ ] Notificaciones push
- [ ] Integración con WhatsApp
- [ ] Sistema de pagos online
- [ ] App móvil nativa
- [ ] Reportes avanzados con gráficos

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**MoeEstilos** - [@moestilos](https://github.com/moestilos)
- Email: gmateosoficial@gmail.com

## 🙏 Agradecimientos

- Material-UI por los componentes elegantes
- Framer Motion por las animaciones fluidas
- La comunidad de React por el ecosistema increíble
- MongoDB por la base de datos flexible

## 📞 Soporte

Si necesitas ayuda o tienes preguntas:
- 📧 Email: gmateosoficial@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/moestilos/PeluMous/issues)

---

⭐ ¡Si te gusta este proyecto, dale una estrella en GitHub!

**Desarrollado con ❤️ por MoeEstilos**
