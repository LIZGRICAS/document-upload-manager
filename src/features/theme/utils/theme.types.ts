/**
 * Theme Types
 * 
 * Type definitions for theme management
 */

export type Theme = 'light' | 'dark'

export interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  isDark: boolean
  isSystem: boolean
}
