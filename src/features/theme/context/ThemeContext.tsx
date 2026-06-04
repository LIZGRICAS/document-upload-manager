/**
 * Theme Context
 * 
 * Single source of truth for theme state
 * Provides theme value and actions to all children
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import type { Theme } from '../utils/theme.types'
import { getStoredTheme, getSystemTheme, setStoredTheme } from '../utils/theme.storage'

// Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Initial theme determination
const getInitialTheme = (): Theme => {
  // 1. Check localStorage first
  const stored = getStoredTheme()
  if (stored) return stored
  
  // 2. Fall back to system preference
  return getSystemTheme()
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme)
  const [isSystem, setIsSystem] = useState(false)

  // Apply theme class to document
  useEffect(() => {
    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  // Listen for system theme changes
  useEffect(() => {
    if (isSystem) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (event: MediaQueryListEvent) => {
        const newTheme = event.matches ? 'dark' : 'light'
        setThemeState(newTheme)
        setStoredTheme(newTheme)
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [isSystem])

  // Check if user's choice matches system
  useEffect(() => {
    if (!isSystem) {
      const stored = getStoredTheme()
      if (!stored) {
        setIsSystem(true)
        setThemeState(getSystemTheme())
      }
    }
  }, [])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    setStoredTheme(newTheme)
    setIsSystem(false)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  const value: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
    isSystem,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export default useTheme
