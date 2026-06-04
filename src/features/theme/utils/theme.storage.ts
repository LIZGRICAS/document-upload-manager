/**
 * Theme Storage Utilities
 * 
 * Handles localStorage persistence for theme preference
 * Safe for SSR/Node.js environments
 */

import type { Theme } from './theme.types'

export const STORAGE_KEY = 'theme'

/**
 * Get theme from localStorage
 * Returns null if not set or in server environment
 */
export const getStoredTheme = (): Theme | null => {
  if (typeof window === 'undefined') {
    return null
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') {
      return stored
    }
    return null
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error)
    return null
  }
}

/**
 * Save theme to localStorage
 */
export const setStoredTheme = (theme: Theme): void => {
  if (typeof window === 'undefined') {
    return
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error)
  }
}

/**
 * Get system theme preference
 * Returns 'light' or 'dark' based on OS setting
 */
export const getSystemTheme = (): Theme => {
  if (typeof window === 'undefined') {
    return 'light'
  }
  
  try {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
    return prefersDark.matches ? 'dark' : 'light'
  } catch (error) {
    console.warn('Failed to detect system theme:', error)
    return 'light'
  }
}

/**
 * Check if system prefers dark theme
 */
export const systemPrefersDark = (): boolean => {
  return getSystemTheme() === 'dark'
}
