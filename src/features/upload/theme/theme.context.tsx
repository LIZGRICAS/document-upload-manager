/**
 * Theme Context
 * 
 * Single source of truth for dark/light mode
 * Provides theme state, persistence, and system preference detection
 */

'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'

export type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  isSystemTheme: boolean
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  systemPrefersDark: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const THEME_KEY = 'theme'

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light')
  const [isSystemTheme, setIsSystemTheme] = useState(true)
  const [systemPrefersDark, setSystemPrefersDark] = useState(false)

  // Initialize theme on client
  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_KEY) as Theme | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    setSystemPrefersDark(prefersDark)

    if (storedTheme) {
      setThemeState(storedTheme)
      setIsSystemTheme(false)
      applyTheme(storedTheme)
    } else {
      setThemeState(prefersDark ? 'dark' : 'light')
      setIsSystemTheme(true)
      applyTheme(prefersDark ? 'dark' : 'light')
    }
  }, [])

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (event: MediaQueryListEvent) => {
      if (isSystemTheme) {
        const newTheme = event.matches ? 'dark' : 'light'
        setThemeState(newTheme)
        applyTheme(newTheme)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [isSystemTheme])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    setIsSystemTheme(false)
    localStorage.setItem(THEME_KEY, newTheme)
    applyTheme(newTheme)
  }, [])

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }, [theme, setTheme])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isSystemTheme,
        setTheme,
        toggleTheme,
        systemPrefersDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

const applyTheme = (theme: Theme) => {
  const root = window.document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    // Fallback for when context is not available (should not happen in normal use)
    return {
      theme: 'light',
      isSystemTheme: true,
      setTheme: () => console.warn('useTheme called outside of ThemeProvider'),
      toggleTheme: () => console.warn('useTheme called outside of ThemeProvider'),
      systemPrefersDark: false,
    }
  }
  return context
}

// Legacy compatibility hook - wrapper around useTheme
export const useDarkMode = (): {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
} => {
  const { theme, toggleTheme, setTheme } = useTheme()
  return { theme, toggleTheme, setTheme }
}
