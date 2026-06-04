/**
 * useUploadManager Hook
 * 
 * Business logic orchestrator
 * UI -> useUploadManager -> UploadContext -> UploadService
 * 
 * Responsibilities:
 * - addFiles
 * - retryFile
 * - cancelFile
 * - removeFile
 * - submitForm
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { useUploadContext } from '../store'
import { createUploadService } from '../services'
import { UploadError, UploadErrorCode } from '../types/upload.error'
import type { UploadJob } from '../types/upload.types'

export const useUploadManager = (maxConcurrent = 3) => {
  const {
    jobs,
    addFiles,
    removeFile,
    clearFiles,
    startUpload,
    startAllUploads,
    setProgress,
    setCompleted,
    setError,
    cancelUpload,
    retryUpload,
    hasErrors,
  } = useUploadContext()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({})
  const serviceRef = useRef<any>(null)
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map())
  const submissionErrorRef = useRef<string | null>(null)

  // Sync submissionError ref for cleanup callback
  useEffect(() => {
    submissionErrorRef.current = submissionError
  }, [submissionError])

  // Initialize service
  useEffect(() => {
    serviceRef.current = createUploadService()
  }, [])

  // Cleanup abort controllers on unmount
  useEffect(() => {
    const controllers = abortControllersRef.current
    return () => {
      controllers.forEach((controller) => controller.abort())
      controllers.clear()
    }
  }, [])

  // Add files to state
  const handleAddFiles = useCallback(
    async (files: File[]) => {
      addFiles(files)
      
      // Auto-start uploads if not already uploading
      const nonDuplicateJobs = jobs.filter((j) => !j.isDuplicate)
      if (nonDuplicateJobs.length > 0) {
        startAllUploads()
      }
    },
    [addFiles, jobs, startAllUploads]
  )

  // Retry a specific file
  const handleRetry = useCallback(
    async (id: string) => {
      retryUpload(id)
      
      const job = jobs.find((j) => j.id === id)
      if (job && !job.isDuplicate) {
        const abortController = new AbortController()
        abortControllersRef.current.set(id, abortController)

        try {
          const result = await serviceRef.current.uploadOnce(
            job.file,
            {
              title: '', // Will be filled by form
              description: '', // Will be filled by form
              onProgress: (progress: number) => setProgress(id, progress),
              abortSignal: abortController.signal,
            }
          )

          setCompleted(id, result.url)
          abortControllersRef.current.delete(id)
        } catch (error) {
          if (error instanceof UploadError) {
            setError(id, error.message)
          } else if (error instanceof Error) {
            setError(id, error.message)
          } else {
            setError(id, 'Error desconocido')
          }
        }
      }
    },
    [jobs, retryUpload, setProgress, setCompleted, setError]
  )

  // Cancel a specific file
  const handleCancel = useCallback(
    async (id: string) => {
      const job = jobs.find((j) => j.id === id)
      if (job && job.status === 'uploading') {
        const controller = abortControllersRef.current.get(id)
        if (controller) {
          controller.abort()
        }
        cancelUpload(id)
      }
    },
    [jobs, cancelUpload]
  )

  // Remove a specific file
  const handleRemove = useCallback(
    (id: string) => {
      // Cancel if uploading
      const job = jobs.find((j) => j.id === id)
      if (job && job.status === 'uploading') {
        handleCancel(id)
      }
      removeFile(id)
    },
    [jobs, handleCancel, removeFile]
  )

  // Submit form
  const handleSubmit = useCallback(
    async (title: string, description: string) => {
      if (hasErrors) {
        setSubmissionError('No se puede enviar el formulario con archivos con error')
        return { success: false, error: 'Errores en upload' }
      }

      setIsSubmitting(true)
      setSubmissionError(null)

      try {
        // Wait for all uploads to complete
        const nonDuplicateJobs = jobs.filter((j) => !j.isDuplicate && j.status !== 'done')
        
        if (nonDuplicateJobs.length > 0) {
          // Auto-start remaining uploads
          nonDuplicateJobs.forEach((job) => startUpload(job.id))
        }

        // Wait for all to complete
        const completedJobs = []
        for (const job of jobs) {
          if (!job.isDuplicate && job.status === 'done') {
            completedJobs.push({ id: job.id, url: job.url })
            setUploadedFiles((prev) => ({ ...prev, [job.id]: job.url }))
          }
        }

        // Submit to backend
        const response = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            description,
            files: completedJobs,
          }),
        })

        if (!response.ok) {
          throw new Error('Error al enviar el formulario')
        }

        return { success: true, data: await response.json() }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
        setSubmissionError(errorMessage)
        return { success: false, error: errorMessage }
      } finally {
        setIsSubmitting(false)
      }
    },
    [jobs, hasErrors, startUpload, setUploadedFiles]
  )

  // Clear all files
  const handleClear = useCallback(() => {
    clearFiles()
    const controllers = abortControllersRef.current
    controllers.forEach((controller) => controller.abort())
    controllers.clear()
    setUploadedFiles({})
    setSubmissionError(null)
  }, [clearFiles])

  // Get progress for a specific file
  const getFileProgress = useCallback(
    (id: string): number | null => {
      const job = jobs.find((j) => j.id === id)
      if (job?.status === 'uploading' || job?.status === 'error' || job?.status === 'cancelled') {
        return job.progress
      }
      return null
    },
    [jobs]
  )

  // Get status for a specific file
  const getFileStatus = useCallback(
    (id: string): string | null => {
      const job = jobs.find((j) => j.id === id)
      return job?.status || null
    },
    [jobs]
  )

  return {
    // State
    jobs,
    isSubmitting,
    submissionError,
    uploadedFiles,

    // Actions
    handleAddFiles,
    handleRetry,
    handleCancel,
    handleRemove,
    handleSubmit,
    handleClear,

    // Helpers
    getFileProgress,
    getFileStatus,
    hasErrors,
  }
}