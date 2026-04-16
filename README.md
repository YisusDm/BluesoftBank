# 🏦 BluesoftBank Frontend

![Angular](https://img.shields.io/badge/Angular-21-DD0031)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38B2AC)
![Angular Material](https://img.shields.io/badge/Angular%20Material-21-9C27B0)
![License](https://img.shields.io/badge/License-Internal-lightgrey)

Frontend web de Bluesoft Bank para gestión de cuentas bancarias, operaciones monetarias y reportes operativos. La aplicación está construida con **Angular 21**, **standalone components**, **SSR**, **Signals** y una arquitectura modular por dominios.

---

## 📋 Tabla de Contenidos

1. [Descripción General](#descripción-general)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Arquitectura](#arquitectura)
4. [Instalación y Configuración](#instalación-y-configuración)
5. [Ejecución](#ejecución)
6. [Rutas Principales](#rutas-principales)
7. [Dominios Funcionales](#dominios-funcionales)
8. [Integración con la API](#integración-con-la-api)
9. [Testing](#testing)
10. [Estructura del Proyecto](#estructura-del-proyecto)
11. [Documentación](#documentación)
12. [Roadmap](#roadmap)

---

## Descripción General

**BluesoftBank Frontend** es una SPA bancaria con renderizado SSR que consume la API de Bluesoft Bank para:

- Gestionar cuentas de ahorro y corriente.
- Consignar y retirar dinero.
- Consultar saldo, movimientos y extracto mensual.
- Visualizar reportes de top clientes y retiros fuera de ciudad.
- Manejar errores de negocio de forma centralizada con notificaciones legibles.

### Características principales

- Componentes standalone y lazy loading por dominio.
- Arquitectura por capas con `core`, `shared` y `features`.
- Interceptores HTTP para auth, error y loading.
- Guards de navegación y manejo de roles.
- Estado local con Signals y RxJS.
- Formatos monetarios en COP y validaciones reactivas.
- UI responsiva con Angular Material, Tailwind y Bootstrap Icons.

---

## Stack Tecnológico

### Framework y Lenguaje

| Componente | Versión | Descripción |
|---|---|---|
| **Angular** | 21 | Framework principal del frontend |
| **TypeScript** | 5.9 | Lenguaje base del proyecto |
| **RxJS** | 7.8 | Programación reactiva y flujos HTTP |
| **SSR** | Angular SSR | Renderizado del lado del servidor |

### UI y Estilos

| Componente | Versión | Descripción |
|---|---|---|
| **Tailwind CSS** | 4 | Utilidades de estilo |
| **Angular Material** | 21 | Componentes UI base |
| **Bootstrap Icons** | 1.13 | Íconos de interfaz |

### Integración y Utilidades

| Componente | Propósito |
|---|---|
| **SignalR** | Actualizaciones en tiempo real de reportes |
| **Vitest** | Pruebas unitarias |
| **Angular Router** | Navegación y lazy loading |
| **HttpClient** | Consumo de API REST |

---

## Arquitectura

La aplicación está organizada por dominios y responsabilidades claras:

### Capas principales

- `src/app/core`: interceptores, guards, modelos de error, SignalR y servicios transversales.
- `src/app/shared`: componentes reutilizables, pipes, directivas y páginas genéricas.
- `src/app/features/cuentas`: listado, detalle, creación, extracto y operaciones bancarias.
- `src/app/features/reportes`: top clientes y retiros fuera de ciudad.
- `src/app/dashboard`: shell principal de la aplicación.

### Principios aplicados

- Standalone components en lugar de módulos tradicionales.
- Lazy loading por dominio.
- Signals para estado local y derivado.
- Servicios centralizados para acceso a API.
- Interceptores para manejo consistente de errores y loading.
- Guards para proteger navegación a rutas internas.
- Formularios reactivos con validaciones y formato monetario.

### Flujo general

```text
UI / Pages
  ↓
Feature Components
  ↓
Services / State
  ↓
HttpClient + Interceptors
  ↓
Bluesoft Bank API
```

---

## Instalación y Configuración

### Prerrequisitos

- Node.js y npm.
- Angular CLI compatible con Angular 21.
- La API de Bluesoft Bank ejecutándose en desarrollo.

### Instalación

```bash
npm install
```

### Variables y entorno

La app consume la API en desarrollo desde:

- `https://localhost:7247/api`

La configuración de entornos se maneja en los archivos de `src/environments` y en las sustituciones definidas en `angular.json`.

---

## Ejecución

### Desarrollo

```bash
npm start
```

Levanta la aplicación en modo desarrollo.

Luego abre:

```text
http://localhost:4200/
```

### Desarrollo con configuración explícita

```bash
npm run dev
```

### Producción en modo servidor local

```bash
npm run prod
```

### Compilación

```bash
npm run build
```

### Pruebas unitarias

```bash
npm run test
```

### SSR

```bash
npm run serve:ssr:BluesoftBank
```

---

## Rutas Principales

- `/cuentas`: listado de cuentas.
- `/cuentas/:id`: detalle de cuenta.
- `/cuentas/:id/extracto`: extracto mensual.
- `/reportes`: tablero de reportes.
- `/no-encontrada`: página 404.

---

## Dominios Funcionales

### Cuentas

- Listado paginado de cuentas.
- Detalle de cuenta con saldo y cliente.
- Creación de cuenta de ahorro.
- Creación de cuenta corriente.
- Consignación y retiro.
- Movimientos recientes.
- Extracto mensual.

### Reportes

- Top clientes por periodo.
- Retiros fuera de ciudad.
- Actualización en tiempo real vía SignalR.

### Shared

- Alertas.
- Cargadores.
- Paginador.
- Pipes de fecha, cuenta, transacción y moneda.
- Directivas de formato monetario.

---

## Integración con la API

La aplicación consume la API REST documentada en [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md).

### Base URL de desarrollo

```text
https://localhost:7247
```

### Recursos principales consumidos

- `GET /api/cuentas`
- `GET /api/cuentas/{id}`
- `POST /api/cuentas/ahorro`
- `POST /api/cuentas/corriente`
- `POST /api/cuentas/{id}/consignar`
- `POST /api/cuentas/{id}/retirar`
- `GET /api/cuentas/{id}/movimientos`
- `GET /api/cuentas/{id}/extracto`
- `GET /api/reportes/top-clientes`
- `GET /api/reportes/retiros-fuera-ciudad`

### Manejo de errores

La UI interpreta respuestas tipo `ProblemDetails` para mostrar mensajes de negocio como:

- Cuenta no encontrada.
- Número de cuenta duplicado.
- Saldo insuficiente.
- Monto mínimo de retiro no alcanzado.
- Conflicto de concurrencia.

---

## Testing

```bash
npm run test
```

Pruebas actuales orientadas a:

- Servicios HTTP.
- Pipes.
- Componentes de formularios.
- Manejo de errores y validaciones.

---

## Estructura del Proyecto

```text
src/
├── app/
│   ├── core/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── models/
│   │   ├── services/
│   │   └── signalr/
│   ├── dashboard/
│   ├── features/
│   │   ├── cuentas/
│   │   └── reportes/
│   └── shared/
│       ├── components/
│       ├── directives/
│       ├── pages/
│       └── pipes/
├── environments/
├── main.ts
├── main.server.ts
└── server.ts
```

---

## Documentación

- [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) - contrato completo de la API.
- [docs/BluesoftBank.md](docs/BluesoftBank.md) - contexto funcional del proyecto.
- [docs/Plan-Implementacion-BluesoftBank.md](docs/Plan-Implementacion-BluesoftBank.md) - plan de implementación por fases.

---

## Roadmap

### Completado

- Arquitectura base por dominios.
- Cuentas: listado, detalle, creación y operaciones.
- Reportes principales.
- Interceptores y guards.
- SSR y configuración de entornos.
- Manejo centralizado de errores y notificaciones.

### Pendiente o evolutivo

- Ajustes adicionales de UX.
- Nuevas pantallas administrativas.
- Pruebas de integración más amplias.
- Mejora de observabilidad y telemetría.

---

## Licencia

Proyecto interno de Bluesoft Bank.
