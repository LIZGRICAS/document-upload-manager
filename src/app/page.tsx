/**
 * Home Page
 * 
 * Main application component
 * Includes dark mode toggle and upload interface
 */

'use client'

import React from 'react'
import { UploadProvider } from '../features/upload'
import { UploadForm } from '../features/upload/components/UploadForm'
import { FilesTable } from '../features/upload/components/FilesTable'
import { ThemeToggle } from '../features/upload/components/ThemeToggle'

export default function HomePage() {
  return (
    <UploadProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        {/* Header with dark mode toggle */}
        <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Document Upload Manager
            </h1>
            <ThemeToggle />
          </div>
        </header>

        {/* Main content */}
        <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <UploadForm />
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enterprise File Upload System v1.0.0
            </p>
          </div>
        </footer>
      </div>
    </UploadProvider>
  )
}