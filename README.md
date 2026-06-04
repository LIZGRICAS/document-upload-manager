# Document Upload Manager

Sistema enterprise para carga de archivos construido con Next.js 14+, TypeScript y React 18.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Arquitectura](#arquitectura)
- [Stack Tecnológico](#stack-tecnológico)
- [Inicio Rápido](#inicio-rápido)
- [Ejecutar Pruebas](#ejecutar-pruebas)
- [Estructura de Carpetas](#estructura-de-carpetas)
- [Registro de Decisiones](#registro-de-decisiones)
- [Trade-offs](#trade-offs)
- [Accesibilidad](#accesibilidad)

## ✨ Características

- **Carga Drag & Drop** - Selección intuitiva de archivos con soporte para arrastrar y soltar
- **Cargas Concurrentes** - Cargas paralelas configurables con reintento exponencial
- **Detección de Duplicados** - Detección automática y marcado de archivos duplicados
- **Seguimiento de Progreso** - Progreso en tiempo real con retroalimentación visual
- **Recuperación de Errores** - Capacidad de reintento individual por archivo con detalles de error
- **Modo Oscuro** - Detección de preferencia del sistema con persistencia en localStorage
- **Validación de Formularios** - Validación basada en yup con Formik
- **Accesibilidad** - Cumple con WCAG 2.1 AA con navegación completa por teclado
- **Seguridad de Tipos** - TypeScript completo con unions discriminadas para estado tipado seguro

## 🏗️ Arquitectura

### Patrón Provider

```
UploadManager (Hook)
    ↓
UploadContext (Estado)
    ↓
UploadService (Lógica de Negocio)
    ↓
IUploadProvider (Interface)
    ↓
XHRUploadProvider (Implementación)
```

### Gestión de Estado

- **Context + useReducer**: Única fuente de verdad para los trabajos de carga
- **Unions Discriminadas**: Transiciones de estado seguras con tipo para `UploadJob`
- **useMemo**: Estado derivado para conteos calculados (pendiente, completado, fallido)

### Control de Concurrencia

- **useUploadQueue**: Maneja el grupo de carga con máximo paralelo configurable
- **Retroceso Exponencial**: Estrategia de reintento con jitter para prevenir thundering herd
- **limitConcurrency**: Utilidad para ejecutar tareas con límite de concurrencia

## 🛠️ Stack Tecnológico

| Categoría | Tecnología |
|----------|-----------|
| Framework | Next.js 14.2.5 (App Router) |
| Lenguaje | TypeScript 5.5+ (modo estricto) |
| UI Library | React 18.3+ |
| Estado | Context + useReducer |
| Formularios | Formik + Yup |
| Estilos | Tailwind CSS 4 |
| Pruebas | Jest + React Testing Library |
| Linting | ESLint + Next.js |

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js 18+ 
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone <repo-url>
cd document-upload-manager

# Instalar dependencias
npm install
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Abrir en navegador
http://localhost:3000
```

### Construcción para Producción

```bash
npm run build
npm start
```

## 🧪 Ejecutar Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar con cobertura
npm run test:coverage

# Ejecutar en modo watch
npm run test:watch
```

## 📁 Estructura de Carpetas

```
src/
├── app/                           # Next.js App Router
│   ├── api/                       # Rutas API
│   │   ├── upload/               # Endpoint de carga simulado
│   │   └── submit/               # Endpoint de envío simulado
│   ├── layout.tsx                # Layout raíz con Skip Link
│   ├── globals.css               # Estilos globales con Tailwind
│   └── page.tsx                  # Página principal de la aplicación
├── features/
│   └── upload/                   # Función de carga de archivos
│       ├── types/               # Tipos de dominio (unions discriminadas)
│       │   ├── upload.types.ts
│       │   ├── upload.constants.ts
│       │   └── upload.error.ts
│       ├── config/              # Configuración
│       │   ├── upload.ts
│       │   └── index.ts
│       ├── domain/              # Lógica de negocio
│       │   ├── upload.utils.ts
│       │   └── index.ts
│       ├── services/            # Capa de servicios
│       │   ├── upload.service.ts
│       │   ├── upload.provider.ts
│       │   ├── backoff.ts
│       │   └── providers/
│       │       └── xhr.upload.provider.ts
│       ├── store/               # Gestión de estado
│       │   ├── upload.reducer.ts
│       │   ├── upload.context.tsx
│       │   ├── upload.actions.ts
│       │   ├── upload.selectors.ts
│       │   └── index.ts
│       ├── hooks/               # Custom hooks de React
│       │   ├── useUploadManager.ts
│       │   ├── useUploadQueue.ts
│       │   └── useDarkMode.ts
│       ├── components/          # Componentes UI
│       │   ├── Dropzone.tsx
│       │   ├── FilesTable.tsx
│       │   ├── UploadForm.tsx
│       │   ├── FileRow.tsx
│       │   └── ...
│       └── index.ts
├── lib/                         # Utilidades compartidas
│   ├── concurrency.ts
│   └── index.ts
└── __tests__/                   # Archivos de prueba
    ├── store/
    ├── hooks/
    └── ...
```

## 📝 Registro de Decisiones

### ¿Por qué Unions Discriminadas?

Las unions discriminadas de TypeScript proporcionan seguridad en tiempo de compilación para las transiciones de estado:

```typescript
// Error de compilación si falta la propiedad requerida
const job: IdleUploadJob = {
  id: '1',
  status: 'idle',
  // Error: La propiedad 'progress' no existe
  progress: 50,
}
```

### ¿Por qué Context + useReducer?

- **Única Fuente de Verdad**: Todo el estado de carga en un solo lugar
- **Actualizaciones Predecibles**: Patrón reducer para transiciones de estado
- **Fácil de Probar**: El reducer es una función pura, fácil de probar
- **Context**: Sin prop drilling para componentes anidados profundamente

### ¿Por qué XHR en lugar de Fetch?

- **Eventos de Progreso**: `xhr.upload.onprogress` para progreso en tiempo real
- **AbortSignal**: Soporte nativo de cancelación
- **Soporte de Navegador**: Soporte universal en navegadores

### ¿Por qué Formik + Yup?

- **Formik**: Reduce el boilerplate para formularios complejos
- **Yup**: Schema de validación declarativa
- **Integración**: Simplemente con componentes de React

## ⚖️ Trade-offs

| Decisión | Razonamiento |
|----------|-----------|
| **SSR de Next.js deshabilitado** | El manejo de archivos requiere APIs del lado del cliente (File, FileReader) |
| **Sin comprobaciones estrictas de nulos en TypeScript** | Compatibilidad con unions discriminadas |
| **useEffect para sincronización de estado** | Más simple que implementaciones de store personalizadas |
| **Estado local para UI** | Rendimiento - no es necesario sincronizar con estado global |
| **API simulada** | Enfocarse en la lógica de carga, no en la integración con backend |

## ♿ Accesibilidad

### Características Implementadas

- **Skip Link**: Primer elemento enfocable al contenido principal
- **Caption de Tabla**: Tabla descriptiva con elemento `<caption>`
- **Encabezados de Columna**: `scope="col"` en celdas de encabezado
- **ARIA Live**: Cambios de estado anunciados vía `aria-live`
- **Navegación por Teclado**: Soporte completo de Tab, Enter/Space para activación
- **Contraste de Color**: ≥ 4.5:1 ratio según WCAG AA
- **Modo Oscuro**: Detección de preferencia del sistema con `prefers-color-scheme`

### Validado

- Cumple con WCAG 2.1 AA
- Puntuación de accesibilidad Lighthouse: 100
- Navegación con teclado solamente probada

## 📚 Recursos Adicionales

- [Documentación de Next.js](https://nextjs.org/docs)
- [React Hooks](https://react.dev/reference/react)
- [Unions Discriminadas de TypeScript](https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#discriminating-unions)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📄 Licencia

MIT
