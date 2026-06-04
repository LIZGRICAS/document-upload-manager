/**
 * useDarkMode Hook (Deprecated - Legacy wrapper)
 * 
 * THIS HOOK IS DEPRECATED AND WILL BE REMOVED IN A FUTURE RELEASE.
 * It now wraps useTheme() from the ThemeContext for backward compatibility.
 * 
 * For new components, use useTheme() from:
 * import { useTheme } from '../theme/theme.context'
 * 
 * @deprecated Use useTheme() instead
 */

import { useTheme } from '../theme/theme.context'
import type { Theme } from '../theme/theme.context'

export const useDarkMode = (): {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
} => {
  const { theme, toggleTheme, setTheme } = useTheme()
  return { theme, toggleTheme, setTheme }
}

export default useDarkMode
