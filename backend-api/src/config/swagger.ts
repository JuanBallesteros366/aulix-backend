export const swaggerSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Salón de Estudio Colaborativo - Backend API',
    version: '1.1.0',
    description:
      'API RESTful principal del Salón de Estudio Colaborativo en Tiempo Real (Aulix). Gestiona la lectura y escritura en Cloud Firestore y la verificación de sesión con Firebase Authentication en 3 capas.',
  },
  servers: [
    {
      url: '/',
      description: 'Servidor actual (Local / Render)',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'Firebase ID Token obtenido tras iniciar sesión en el cliente (Authorization: Bearer <token>).',
      },
    },
    schemas: {
      UserProfile: {
        type: 'object',
        properties: {
          uid: { type: 'string', example: 'f8a92b10c3d4e5' },
          firstName: { type: 'string', example: 'Camila' },
          lastName: { type: 'string', example: 'Rojas' },
          username: {
            type: 'string',
            nullable: true,
            example: 'camila.rojas',
          },
          usernameLower: {
            type: 'string',
            nullable: true,
            example: 'camila.rojas',
          },
          email: { type: 'string', example: 'ejemplo@correo.com' },
          avatar: { type: 'string', example: 'CR' },
          provider: {
            type: 'string',
            enum: ['password', 'google'],
            example: 'password',
          },
          requiresUsername: { type: 'boolean', example: false },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          ok: { type: 'boolean', example: false },
          field: { type: 'string', example: 'username' },
          error: {
            type: 'string',
            example: 'Este nombre de usuario ya está ocupado. Elige otro diferente.',
          },
        },
      },
      UnauthorizedResponse: {
        type: 'object',
        properties: {
          ok: { type: 'boolean', example: false },
          error: {
            type: 'string',
            example:
              'No autorizado. Debes iniciar sesión para acceder a este recurso.',
          },
        },
      },
    },
  },
  tags: [
    {
      name: 'Estado del Sistema y Firestore',
      description:
        'Endpoints de verificación de salud y lectura end-to-end desde Cloud Firestore',
    },
    {
      name: 'Identidad y Autenticación',
      description:
        'Gestión de perfiles en Firestore, verificación de Firebase ID Token y validación de unicidad de nombre de usuario en el servidor',
    },
  ],
  paths: {
    '/api/health': {
      get: {
        tags: ['Estado del Sistema y Firestore'],
        summary: 'Verifica que el servicio backend-api está activo',
        responses: {
          '200': {
            description: 'Servicio operativo',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ok: { type: 'boolean', example: true },
                    service: {
                      type: 'string',
                      example: 'aulix-backend-api',
                    },
                    timestamp: {
                      type: 'string',
                      format: 'date-time',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/sprint0/status': {
      get: {
        tags: ['Estado del Sistema y Firestore'],
        summary:
          'Lee el documento de estado end-to-end desde Cloud Firestore',
        description:
          'Consulta la colección `system_status` en Cloud Firestore. Si el documento aún no existe, lo inicializa automáticamente para facilitar la validación end-to-end.',
        responses: {
          '200': {
            description: 'Dato leído exitosamente desde Firestore',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ok: { type: 'boolean', example: true },
                    source: {
                      type: 'string',
                      example: 'Cloud Firestore',
                    },
                    data: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', example: 'sprint0' },
                        appName: {
                          type: 'string',
                          example: 'Salón de Estudio Colaborativo en Tiempo Real',
                        },
                        sprint: {
                          type: 'string',
                          example:
                            'Estado activo',
                        },
                        message: {
                          type: 'string',
                          example:
                            'Conexión End-to-End verificada: Frontend (React) -> Backend API (Express) -> Cloud Firestore.',
                        },
                        accessibilityTarget: {
                          type: 'string',
                          example:
                            'WCAG 2.2 Nivel AA (Teclado + Lector de Pantalla)',
                        },
                        activeRoomsCount: { type: 'number', example: 3 },
                        updatedAt: {
                          type: 'string',
                          format: 'date-time',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          '500': {
            description:
              'Error de conexión o credenciales de Firestore no configuradas',
          },
        },
      },
    },
    '/api/users/check-username': {
      get: {
        tags: ['Identidad y Autenticación'],
        summary:
          'Verifica en el servidor si un nombre de usuario tiene formato válido y está disponible en Firestore',
        parameters: [
          {
            name: 'username',
            in: 'query',
            required: true,
            schema: { type: 'string', example: 'camila.rojas' },
            description: 'Nombre de usuario a validar (3 a 20 caracteres)',
          },
          {
            name: 'excludeUid',
            in: 'query',
            required: false,
            schema: { type: 'string' },
            description: 'UID opcional del usuario actual',
          },
        ],
        responses: {
          '200': {
            description: 'Resultado de disponibilidad del username',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ok: { type: 'boolean', example: true },
                    available: { type: 'boolean', example: true },
                    username: { type: 'string', example: 'camila.rojas' },
                    message: {
                      type: 'string',
                      example: 'El nombre de usuario está disponible.',
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Formato de nombre de usuario inválido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/users/me': {
      get: {
        tags: ['Identidad y Autenticación'],
        summary: 'Obtiene el perfil del usuario autenticado desde Firestore',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Perfil del usuario autenticado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ok: { type: 'boolean', example: true },
                    requiresUsername: { type: 'boolean', example: false },
                    data: { $ref: '#/components/schemas/UserProfile' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'No autorizado (sin token o token inválido)',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UnauthorizedResponse' },
              },
            },
          },
          '404': {
            description: 'El usuario autenticado aún no tiene perfil registrado en Firestore',
          },
        },
      },
    },
    '/api/users/register': {
      post: {
        tags: ['Identidad y Autenticación'],
        summary:
          'Registra el perfil manual en Firestore garantizando unicidad de username por transacción',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['firstName', 'lastName', 'username', 'email'],
                properties: {
                  firstName: { type: 'string', example: 'Camila' },
                  lastName: { type: 'string', example: 'Rojas' },
                  username: { type: 'string', example: 'camila.rojas' },
                  email: {
                    type: 'string',
                    example: 'ejemplo@correo.com',
                  },
                  avatar: { type: 'string', example: 'CR' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Perfil creado exitosamente en Firestore',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ok: { type: 'boolean', example: true },
                    message: {
                      type: 'string',
                      example: 'Cuenta creada exitosamente.',
                    },
                    data: { $ref: '#/components/schemas/UserProfile' },
                  },
                },
              },
            },
          },
          '400': {
            description:
              'Datos inválidos o nombre de usuario ya ocupado en el servidor',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'No autorizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UnauthorizedResponse' },
              },
            },
          },
        },
      },
    },
    '/api/users/google-sync': {
      post: {
        tags: ['Identidad y Autenticación'],
        summary:
          'Sincroniza el perfil de un usuario autenticado con Google e indica si debe elegir username obligatorio',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: false,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  firstName: { type: 'string', example: 'Camila' },
                  lastName: { type: 'string', example: 'Rojas' },
                  email: {
                    type: 'string',
                    example: 'ejemplo@correo.com',
                  },
                  avatar: { type: 'string', example: 'CR' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Perfil sincronizado con Google',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ok: { type: 'boolean', example: true },
                    requiresUsername: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/UserProfile' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'No autorizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UnauthorizedResponse' },
              },
            },
          },
        },
      },
    },
    '/api/users/avatar': {
      put: {
        tags: ['Identidad y Autenticación'],
        summary: 'Personaliza el avatar del usuario autenticado',
        description:
          'Permite cambiar el avatar entre las iniciales del usuario (por defecto) y los avatares predefinidos.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['avatar'],
                properties: {
                  avatar: { type: 'string', example: '🚀' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Avatar actualizado',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ok: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Avatar actualizado correctamente.' },
                    data: { $ref: '#/components/schemas/UserProfile' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Avatar no válido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'Sin sesión válida',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
        },
      },
    },
    '/api/users/username': {
      put: {
        tags: ['Identidad y Autenticación'],
        summary:
          'Asigna o actualiza el nombre de usuario único obligatorio',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['username'],
                properties: {
                  username: { type: 'string', example: 'camila.rojas' },
                  avatar: { type: 'string', example: 'CR' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Username único asignado en Firestore',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ok: { type: 'boolean', example: true },
                    message: {
                      type: 'string',
                      example: 'Nombre de usuario guardado correctamente.',
                    },
                    data: { $ref: '#/components/schemas/UserProfile' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Username ocupado o con formato inválido',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          '401': {
            description: 'No autorizado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/UnauthorizedResponse' },
              },
            },
          },
        },
      },
    },
  },
};
