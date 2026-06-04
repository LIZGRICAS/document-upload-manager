# Propuesta de Refactorización: Dark/Light Mode Architecture

## **Problemas Actuales**

| Problema | Impacto | Prioridad |
|----------|---------|-----------|
| FOUC en hidratación | UX negativo | ⚠️ ALTO |
| Clase `dark` hardcodeada | Modo incorrecto por defecto | ⚠️ ALTO |
| Doble lógica de tema | Inconsistencias | ⚠️ MEDIO |
| Sin ThemeContext | Imposibilidad de extender | ⚠️ MEDIO |
| Código duplicado | Mantenibilidad baja | ⚠️ BAJO |

---

## **Arquitectura Propuesta**

### **1. Estructura de Carpetas**
```
src/
├── features/
│   └── theme/
│       ├── context/
│       │   ├── ThemeContext.tsx      # Provider
│       │   └── ThemeProvider.tsx     # Wrapper component
│       ├── hooks/
│       │   ├── useTheme.ts           # Hook principal
│       │   └── useSystemTheme.ts     # Detecta preferencia sistema
│       ├── utils/
│       │   ├── theme.storage.ts      # Persistencia
│       │   └── theme.classes.ts      # Gestión de clases
│       └── index.ts
```

### **2. Desglose de Cambios**

#### **A. Theme Context (NUEVO)**
**Objetivo:** Una única fuente de verdad para el tema

```tsx
// features/theme/context/ThemeContext.tsx
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }) => {
  // Gestiona tema en estado global
  // Persiste en localStorage
  // Detecta preferencia del sistema
  return (
    <ThemeContext.Provider value={themeContext}>
      {children}
    </ThemeContext.Provider>
  )
}
```

#### **B. Theme Provider Wrapper (NUEVO)**
**Objetivo:** Envolver la aplicación sin modificar layout.tsx existente

```tsx
// features/theme/context/ThemeProvider.tsx
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme()
  
  useEffect(() => {
    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])
  
  return <>{children}</>
}
```

#### **C. useTheme Hook (REFACTORIZADO)**
**Objetivo:** Lógica unificada y limpia

```tsx
// features/theme/hooks/useTheme.ts
export const useTheme = () => {
  const { theme, setTheme } = useContext(ThemeContext)
  
  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])
  
  return { theme, toggleTheme, isDark: theme === 'dark' }
}
```

#### **D. Persistencia (NUEVO)**
**Objetivo:** Guardar preferencia de tema

```tsx
// features/theme/utils/theme.storage.ts
export const getStoredTheme = (): Theme | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('theme') as Theme
}

export const setStoredTheme = (theme: Theme): void => {
  localStorage.setItem('theme', theme)
}

export const getSystemTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches 
    ? 'dark' 
    : 'light'
}
```

---

## **Implementación Paso a Paso**

### **Fase 1: Crear estructura de carpetas**
- Crear `src/features/theme/`
- Subcarpetas: `context/`, `hooks/`, `utils/`, `components/`

### **Fase 2: Implementar utilities**
- `theme.storage.ts`: lectura/escritura localStorage
- `theme.classes.ts`: gestión de clases CSS

### **Fase 3: Implementar ThemeContext**
- `ThemeContext.tsx`: contexto React
- `ThemeProvider.tsx`: wrapper component

### **Fase 4: Refactorizar useDarkMode → useTheme**
- Consolidar lógica
- Eliminar duplicados

### **Fase 5: Actualizar layout.tsx**
- Quitar `className="dark"` del `<html>`
- Envolver con `ThemeProvider`

### **Fase 6: Actualizar componentes**
- Reemplazar `useDarkMode` por `useTheme`
- Asegurar que todos usen `dark:` variants de Tailwind

---

## **Validaciones Post-Implementación**

| Validación | Método |
|------------|--------|
| Tema persiste al recargar | Recargar página, verificar tema |
| Tema persiste al cerrar pestaña | Cerrar y abrir pestaña |
| Sin FOUC | Verificar primera carga |
| Sin hydration mismatch | Verificar console browser |
| Responsive no roto | Probar en móvil |
| Dark: variants aplicadas | Inspector DOM |

---

## **Riesgos y Mitigaciones**

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Breaking change en hooks | MEDIA | ALTO | Mantener API compatible, deprecar gradualmente |
| Hydration mismatch | BAJA | CRÍTICO | Validar siempre typeof window |
| FOUC residual | BAJA | MEDIO | Usar inline script para clase inicial |

---

## **Comparativa: Antes vs Después**

### **Antes**
```tsx
// layout.tsx - PROBLEMÁTICO
<html lang="es" className="dark"> {/* Hardcodeado */}
<body>
  <UploadProvider> {/* Tema local en hook */}
    {children}
  </UploadProvider>
</body>
</html>

// useDarkMode.ts - DUPLICADO
const [theme, setTheme] = useState('light') // Estado local
useEffect(() => { /* Aplicar clase */ }) // Duplicado
```

### **Después**
```tsx
// layout.tsx - CORRECTO
<html lang="es"> {/* Sin clase hardcodeada */}
<ThemeProvider> {/* Provider global */}
  <body>
    <UploadProvider>
      {children}
    </UploadProvider>
  </body>
</ThemeProvider>
</html>

// useTheme.ts - LIMPIO
const { theme, toggleTheme } = useTheme() // Una sola fuente
```

---

## **Conclusión**

La refactorización propuesta:
- ✅ Elimina FOUC
- ✅ Centraliza gestión de tema
- ✅ Mejora mantenibilidad
- ✅ Permite extensión futura
- ✅ Cumple con SSR de Next.js
- ✅ Preserva funcionalidad actual

**Tiempo estimado:** 4-6 horas
**Impacto en funcionalidad:** Cero (solo refactorización de tema)