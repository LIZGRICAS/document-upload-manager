/**
 * Theme Client Wrapper
 * 
 * Client component that wraps ThemeProvider
 * Allows Server Components (like layout) to export metadata
 */

'use client'

import React from 'react'
import { ThemeProvider } from './theme.context'

interface ThemeClientWrapperProps {
  children: React.ReactNode
}

export const ThemeClientWrapper: React.FC<ThemeClientWrapperProps> = ({ children }) => {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  )
}
