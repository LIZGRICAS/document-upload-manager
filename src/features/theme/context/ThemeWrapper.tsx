/**
 * Theme Wrapper Component
 * 
 * Wrapper that applies theme class without modifying layout.tsx
 * Can be used in pages that need theme support
 */

import React from 'react'
import { ThemeProvider } from './ThemeContext'

interface ThemeWrapperProps {
  children: React.ReactNode
}

export const ThemeWrapper = ({ children }: ThemeWrapperProps) => {
  return <ThemeProvider>{children}</ThemeProvider>
}

export default ThemeWrapper
