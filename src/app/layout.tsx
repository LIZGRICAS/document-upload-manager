/**
 * Root Layout
 * 
 * WCAG AA Compliant:
 * - Skip Link for keyboard navigation
 * - Proper document structure
 * - Language attribute
 * 
 * FOUC Protection:
 * - Inline script runs before React hydration
 * - Reads localStorage and system preference before render
 * - Applies theme class immediately
 */

import React from 'react'
import './globals.css'
import { ThemeClientWrapper } from '../features/upload/theme/theme-provider.client'
import { UploadClientWrapper } from '../features/upload/upload-wrapper.client'

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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const stored = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const theme = stored || (prefersDark ? 'dark' : 'light');
                  document.documentElement.classList.toggle('dark', theme === 'dark');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        {/* Skip Link for WCAG AA compliance */}
        <a
          href="#main-content"
          className="fixed top-2 left-2 z-50 bg-blue-600 text-white px-4 py-2 rounded shadow-lg transition-transform duration-200 hover:scale-105 focus:transform focus:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          Saltar al contenido
        </a>
        
        <UploadClientWrapper>
          <ThemeClientWrapper>{children}</ThemeClientWrapper>
        </UploadClientWrapper>
      </body>
    </html>
  )
}
