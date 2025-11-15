# Panel Administrativo Multi-local

Sistema interno construido con Next.js 14 (App Router) + TypeScript para administrar los locales El Roble, Maipú y La Reina. Incluye autenticación propia con RUT, RRHH, turnos, stock, mensajería y notificaciones en tiempo real basadas en Supabase.

## Stack

- Next.js 14 (App Router) + TypeScript
- TailwindCSS v4 + shadcn/ui (botones, tablas, modales, tabs)
- React Query para data fetching
- Zustand para sesión, UI global y notificaciones
- Supabase JS client (3 proyectos)
- bcryptjs + jose para autenticación
- Zod + React Hook Form para formularios

## Estructura principal

```
src/
├─ app/
│  ├─ (auth)/login → flujo de RUT + password
│  ├─ (dashboard)/layout → sidebar + bottom nav + realtime
│  ├─ (dashboard)/dashboard → KPIs generales
│  ├─ (dashboard)/stores/[storeId]/(shifts|stock|staff)
│  ├─ (dashboard)/admin/(employees|payroll|logistics|messages)
│  ├─ (dashboard)/me → perfil del colaborador
│  └─ api/ → login, sesión, RRHH y mensajería
├─ components/ → layout, tablas, providers, notificaciones
├─ features/ → módulos (auth, stores, hr, payroll, messages)
├─ hooks/ → realtime, sesión
├─ lib/ → auth, supabase clients, helpers de tienda
├─ services/ → queries a Supabase por dominio
└─ store/ → Zustand (session/ui/notifications)
```

## Variables de entorno

Copia `.env.example` y reemplaza con tus claves:

```bash
cp .env.example .env.local
```

- `AUTH_SECRET`: string seguro usado para firmar las cookies httpOnly del login
- `NEXT_PUBLIC_SUPABASE_*`: URLs y anon keys de cada proyecto (El Roble, Maipú, La Reina)

## Scripts

```bash
npm install        # instalar dependencias
npm run dev        # desarrollo en http://localhost:3000
npm run build      # build de producción
npm run start      # servir build
npm run lint       # eslint
```

## Flujo de autenticación

1. `/login` envía `rut` + `password` a `POST /api/auth/login`.
2. El endpoint busca al empleado en las tablas `employees` de cada Supabase, compara el hash con bcryptjs y firma un JWT propio (cookie httpOnly).
3. `middleware.ts` y el layout del dashboard validan la cookie antes de renderizar cualquier ruta protegida.

## Módulos listos

- **Dashboard**: KPIs de ventas/turnos/stock y accesos por local.
- **Turnos**: apertura/cierre, historial y alertas por local (`shifts` / `elianamaipu_shifts`).
- **Stock**: tabs (general, bajo stock, próximos críticos) + export CSV y proyección.
- **RRHH**: listado de empleados con filtros, alta desde modal (POST `/api/admin/employees`).
- **Mensajería**: inbox/admin con envío por local, global o directo + realtime via Supabase.
- **Perfil trabajador**: resumen de rol, local y futuras liquidaciones.

## Notificaciones en tiempo real

`useRealtimeNotifications` se activa al entrar al layout y se suscribe a:

- `products` / `elianamaipu_products`
- `shifts` / `elianamaipu_shifts`
- `admin_messages`

Cuando se detecta bajo stock, nuevo turno o mensaje, se agrega una notificación in-app (panel + toasts).

## Despliegue sugerido

1. Configura secrets en Render (Node 20) o plataforma similar (`AUTH_SECRET`, `NEXT_PUBLIC_SUPABASE_*`).
2. Ejecuta `npm run build && npm run start` en el servicio web.
3. Mantén los tres proyectos de Supabase con la misma estructura de tablas (`shifts`, `products`, `employees`, etc.).

> Nota: las tablas `employees`, `attendance`, `payroll` y `admin_messages` deben existir en cada Supabase (o en uno central) con los campos descritos en la solicitud original.
