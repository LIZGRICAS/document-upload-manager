/**
 * Dropzone Component
 *
 * Matches visual reference: dashed border, upload arrow icon,
 * "Drag and drop your files here or click to select them" text
 */

import React, { useCallback, useRef, useState } from 'react'
import { useDropZone } from './useDropZone'

interface DropzoneProps {
  onFilesAdded: (files: File[]) => void
  maxFiles?: number
  isUploading?: boolean
  acceptedTypes?: string
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onFilesAdded,
  maxFiles = 10,
  isUploading = false,
  acceptedTypes = 'pdf',
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
    if (!isUploading) fileInputRef.current?.click()
  }, [isUploading])

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onFilesAdded(Array.from(e.target.files))
        e.target.value = ''
      }
    },
    [onFilesAdded]
  )

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      onDragOver(e)
      setIsDragOver(true)
    },
    [onDragOver]
  )

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      onDragLeave(e)
      setDragCount((prev) => {
        const next = Math.max(0, prev - 1)
        if (next === 0) setIsDragOver(false)
        return next
      })
    },
    [onDragLeave]
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
      setDragCount((prev) => prev + 1)
    },
    [onDragEnter]
  )

  return (
    <div className="border border-gray-300 rounded p-1">
      {/* Header label */}
      <div className="flex items-center gap-1 px-2 pt-1 pb-2">
        <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <span className="text-xs text-gray-500">File Upload</span>
      </div>

      {/* Drop area */}
      <div
        className={`
          border-2 border-dashed rounded mx-1 mb-1 py-8 flex flex-col items-center justify-center cursor-pointer
          transition-colors duration-150
          ${isDragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDragEnter={handleDragEnter}
        onDrop={handleDrop}
        onClick={handleClick}
        role="region"
        aria-label="Drop zone for file upload"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick() }}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleChange}
          disabled={isUploading}
          aria-hidden="true"
          accept={`.${acceptedTypes}`}
        />

        {/* Upload arrow icon */}
        <svg
          className="w-8 h-8 text-gray-400 mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>

        <p className="text-sm text-gray-500 text-center">
          Drag and drop your files here or click to select them
        </p>
        <p className="text-xs text-gray-400 mt-1">Accepted files: {acceptedTypes}</p>
        <p className="text-xs text-gray-400">Max files allowed.</p>
      </div>
    </div>
  )
}
