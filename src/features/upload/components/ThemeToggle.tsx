/**
 * ThemeToggle Component
 * 
 * Dark mode toggle button with ARIA attributes
 * Uses useTheme hook for state management
 */

import React from 'react'
import { useTheme } from '../theme'

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={theme === 'dark'}
      aria-label={`Cambiar a modo ${theme === 'dark' ? 'claro' : 'oscuro'}`}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200'}
      `}
    >
      <span className="sr-only">Toggle dark mode</span>
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200
          ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  )
}

export default ThemeToggle