/**
 * Dropzone Component
 * 
 * Drag & drop zone for file selection
 * Supports drag & drop and click-to-select
 */

import React, { useCallback, useState, useRef, useEffect } from 'react'
import { useDropZone } from './useDropZone'

interface DropzoneProps {
  onFilesAdded: (files: File[]) => void
  maxFiles?: number
  isUploading?: boolean
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onFilesAdded,
  maxFiles = 10,
  isUploading = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [dragCount, setDragCount] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { onDrop, onDragOver, onDragEnter, onDragLeave } = useDropZone({
    onDrop: (files) => {
      onFilesAdded(files)
      setIsDragOver(false)
      setDragCount(0)
    },
  })

  const handleClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const files = Array.from(e.target.files)
        onFilesAdded(files)
      }
    },
    [onFilesAdded]
  )

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      onDragOver(e)
      setIsDragOver(true)
      setDragCount((prev) => prev + 1)
    },
    [onDragOver]
  )

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      onDragLeave(e)
      setDragCount((prev) => Math.max(0, prev - 1))
      if (dragCount <= 1) {
        setIsDragOver(false)
      }
    },
    [onDragLeave, dragCount]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      onDrop(e as any)
      setIsDragOver(false)
      setDragCount(0)
    },
    [onDrop]
  )

  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      onDragEnter(e)
    },
    [onDragEnter]
  )

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-lg p-8 text-center
        transition-all duration-200 ease-in-out
        ${isDragOver
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }
        ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDragEnter={handleDragEnter}
      onDrop={handleDrop}
      onClick={handleClick}
      role="region"
      aria-label="Zona de drag & drop para subir archivos"
      aria-describedby="dropzone-hint"
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleChange}
        disabled={isUploading}
        aria-hidden="true"
      />

      <div className="space-y-2">
        <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            role="img"
            aria-label="Ícono de subir archivos"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        <p className="text-gray-700 dark:text-gray-300 font-medium">
          Arrastra y suelta archivos aquí
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-sm" id="dropzone-hint">
          o haz clic para seleccionar archivos
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
          Máximo {maxFiles} archivos
        </p>
      </div>
    </div>
  )
}