/**
 * useDropZone Hook
 * 
 * Handles drag & drop events for Dropzone component
 */

import { useCallback } from 'react'

interface DropZoneOptions {
  onDrop: (files: File[]) => void
}

export const useDropZone = ({ onDrop }: DropZoneOptions) => {
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.files)
        onDrop(files)
      }
    },
    [onDrop]
  )

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const onDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  return {
    onDrop: handleDrop,
    onDragOver,
    onDragEnter,
    onDragLeave,
  }
}