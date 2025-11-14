# Panel Administrador - Plataforma Educativa

Panel de administración para gestionar usuarios, membresías y estadísticas de la plataforma educativa.

## Características

- 🔐 Autenticación exclusiva para administradores
- 👥 Gestión completa de usuarios (crear, editar, eliminar)
- 💳 Gestión de membresías y suscripciones
- 📊 Dashboard con estadísticas y gráficos
- 📈 Visualización de ingresos y pagos

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
Crear archivo `.env`:
```
VITE_API_URL=http://localhost:3000/api
```

3. Ejecutar en modo desarrollo:
```bash
npm run dev
```

4. Abrir en el navegador:
```
http://localhost:5174
```

## Requisitos

- Usuario con rol `admin` en la base de datos
- Backend corriendo en `http://localhost:3000`

## Estructura del Proyecto

```
src/
├── pages/
│   ├── Login.tsx          # Login de administrador
│   ├── Dashboard.tsx      # Dashboard principal
│   ├── Users.tsx          # Lista de usuarios
│   ├── UserDetail.tsx     # Detalle de usuario
│   └── Memberships.tsx   # Gestión de membresías
├── services/
│   ├── api.ts             # Cliente HTTP
│   ├── auth.service.ts    # Servicio de autenticación
│   └── admin.service.ts   # Servicios de administración
└── App.tsx                # Componente principal
```

## Funcionalidades

### Dashboard
- Estadísticas generales (usuarios, membresías, ingresos)
- Gráficos de membresías por tipo
- Lista de pagos recientes

### Gestión de Usuarios
- Listar usuarios con paginación
- Buscar usuarios
- Filtrar por rol
- Crear nuevos usuarios
- Editar información de usuarios
- Eliminar usuarios
- Ver historial de membresías por usuario

### Gestión de Membresías
- Listar todas las membresías
- Filtrar por estado
- Actualizar estado de membresías
- Ver detalles de pagos

## Tecnologías

- React 18
- TypeScript
- Vite
- React Router DOM
- Recharts (gráficos)

# project-learning-admin
# project-learning-admin
# project-learning-admin
