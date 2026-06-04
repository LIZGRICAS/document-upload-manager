/**
 * Home Page
 *
 * Full structure preserved: UploadProvider, dark mode toggle, header, footer.
 * Default theme is light to match visual reference.
 */

'use client'

import React from 'react'
import { UploadProvider } from '../features/upload'
import { UploadForm } from '../features/upload/components/UploadForm'
import { useDarkMode } from '../features/upload/hooks/useDarkMode'
import { ThemeToggle } from '../features/upload/components/ThemeToggle'

export default function HomePage() {
  const { theme, toggleTheme } = useDarkMode()

  return (
    <UploadProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">

        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="max-w-5xl mx-auto px-6 py-3 flex justify-between items-center">
            <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
              Document Upload Manager
            </h1>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
        </header>

        {/* Main */}
        <main id="main-content" className="max-w-5xl mx-auto px-6 py-8">
          <UploadForm />
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors duration-200">
          <div className="max-w-5xl mx-auto px-6 py-3">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Enterprise File Upload System v1.0.0
            </p>
          </div>
        </footer>

      </div>
    </UploadProvider>
  )
}
