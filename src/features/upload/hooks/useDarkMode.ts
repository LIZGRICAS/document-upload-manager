/**
 * useDarkMode Hook
 * 
 * Dark mode implementation with localStorage persistence
 * Uses matchMedia for system preference detection
 */

import { useState, useEffect, useCallback } from 'react'

type Theme = 'light' | 'dark'

export const useDarkMode = (): {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
} => {
  const [theme, setThemeState] = useState<Theme>('light')
  const [isClient, setIsClient] = useState(false)

  // Initialize on client only
  useEffect(() => {
    setIsClient(true)
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme') as Theme
    if (savedTheme) {
      setThemeState(savedTheme)
      return
    }
    
    // Check system preference
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches
    setThemeState(prefersDark ? 'dark' : 'light')
  }, [])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)
    
    // Apply to document
    const root = window.document.documentElement
    if (newTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event: MediaQueryListEvent) => {
      // Only apply system theme if not in localStorage
      if (!localStorage.getItem('theme')) {
        setTheme(event.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [setTheme])

  // Apply theme on mount
  useEffect(() => {
    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])

  return {
    theme,
    toggleTheme,
    setTheme,
  }
}

// Default export for easy import
export default useDarkMode
