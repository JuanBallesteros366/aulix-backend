# backend-api

API de Aulix hecha con Node.js, TypeScript, Express, Firebase Admin (Firestore y Auth) y Swagger.

El frontend nunca consulta Firestore directamente: todo pasa por esta API.

## Variables de entorno

Copia `.env.example` a `.env` y completa:

| Variable | Para qué sirve |
|---|---|
| `PORT` | Puerto del servidor (en Render lo asigna la plataforma) |
| `NODE_ENV` | `development` o `production` |
| `CORS_ORIGIN` | Dominios del frontend permitidos, separados por coma |
| `SESSION_SECRET` | Texto largo y aleatorio para firmar sesiones |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | JSON de la cuenta de servicio en una sola línea |

En lugar del JSON completo puedes usar `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL` y `FIREBASE_PRIVATE_KEY`.

La clave se genera en Firebase: Configuración del proyecto, Cuentas de servicio, Generar nueva clave privada.

## Ejecutar

```bash
npm install
npm run dev
```

- Estado de la base técnica: http://localhost:4000/api/sprint0/status
- Salud del servicio: http://localhost:4000/api/health
- Swagger: http://localhost:4000/api-docs

## Docker

```bash
docker build -t aulix-backend-api .
docker run -p 4000:4000 --env-file .env aulix-backend-api
```

## Despliegue en Render

1. Crear un Web Service desde el repositorio de GitHub.
2. Root Directory: `backend-api`. Language: `Docker`.
3. Agregar las variables de entorno de la tabla (sin `PORT`).
4. Cuando el frontend esté en Vercel, poner su URL en `CORS_ORIGIN`.

## Capas

`routes` recibe la petición, `services` valida y aplica las reglas, `repositories` habla con Firestore. El middleware `auth.middleware.ts` revisa la sesión en las rutas privadas.
