# Aulix — Backend

Servicios de servidor de **Aulix, Salón de Estudio Colaborativo en Tiempo Real**. El frontend vive en otro repositorio: [aulix-frontend](https://github.com/JuanBallesteros366/aulix-frontend).

**En producción**
- API: https://aulix-backend.onrender.com
- Swagger: https://aulix-backend.onrender.com/api-docs

## Estructura

```text
aulix-backend/
├── backend-api/          API REST (Node.js, TypeScript, Express, Firestore, Swagger)
│   ├── src/
│   │   ├── config/       Firebase Admin y Swagger
│   │   ├── middlewares/  Verificación de sesión (401 sin sesión)
│   │   ├── routes/       Capa de rutas HTTP
│   │   ├── services/     Lógica de negocio y validaciones
│   │   ├── repositories/ Acceso a datos en Firestore
│   │   └── index.ts      Servidor Express
│   ├── .env.example      Variables de entorno sin valores reales
│   └── Dockerfile
├── backend-realtime/     Servidor de tiempo real (se usa desde el Sprint 2)
└── docker-compose.yml    Levanta los dos servicios
```

## Cómo ejecutarlo

Necesitas Node.js 20 o superior y un proyecto de Firebase con Firestore y una clave de cuenta de servicio.

**Con npm**
```bash
cd backend-api
cp .env.example .env     # completa los valores
npm install
npm run dev              # http://localhost:4000
```

**Con Docker Compose** (desde esta carpeta, con `backend-api/.env` ya creado)
```bash
docker compose up --build
```

## Endpoints

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/api/health` | Público |
| GET | `/api/sprint0/status` | Público. Lee `system_status/sprint0` de Firestore |
| GET | `/api/users/check-username` | Público |
| POST | `/api/users/auth/register`, `/auth/login`, `/auth/google` | Público |
| GET | `/api/users/me` | Privado |
| POST | `/api/users/register`, `/api/users/google-sync` | Privado |
| PUT | `/api/users/username`, `/api/users/avatar` | Privado |

Las rutas privadas responden 401 si no hay sesión. El detalle de cada una está en Swagger (`/api-docs`).

## Seguridad

Las claves van en variables de entorno y nunca en el repositorio. El archivo `.env` está en el `.gitignore`.
