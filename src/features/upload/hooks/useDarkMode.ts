/**
 * Dark Mode Hook (Deprecated)
 * 
 * This hook is deprecated and will be removed in a future version.
 * Use useTheme from '@features/theme' instead.
 * 
 * Kept for backwards compatibility during migration.
 */

import { useTheme } from '../theme'

// Re-export useTheme with deprecated warnings
export const useDarkMode = () => {
  console.warn(
    '[DEPRECATED] useDarkMode is deprecated. Use useTheme from @features/theme instead.'
  )
  return {
    theme: useTheme().theme,
    toggleTheme: useTheme().toggleTheme,
    setTheme: useTheme().setTheme,
  }
}

export default useDarkMode
