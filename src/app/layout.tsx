/**
 * Root Layout
 * 
 * WCAG AA Compliant:
 * - Skip Link for keyboard navigation
 * - Proper document structure
 * - Language attribute
 */

import React from 'react'
import './globals.css'

export const metadata = {
  title: 'Document Upload Manager',
  description: 'Enterprise-grade file upload system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        {/* Skip Link for WCAG AA compliance */}
        <a
          href="#main-content"
          className="fixed top-2 left-2 z-50 bg-blue-600 text-white px-4 py-2 rounded shadow-lg transition-transform duration-200 hover:scale-105 focus:transform focus:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          Saltar al contenido
        </a>
        
        {children}
      </body>
    </html>
  )
}
