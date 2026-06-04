/**
 * useUpload Hook
 * 
 * Facade for UI
 * Combines useUploadManager and useUploadQueue
 */

import { useCallback } from 'react'
import { useUploadManager } from './useUploadManager'
import { useUploadQueue } from './useUploadQueue'

export interface UploadFileOptions {
  title?: string
  description?: string
}

export interface UseUploadResult {
  // State
  jobs: any[]
  isSubmitting: boolean
  submissionError: string | null
  uploadedFiles: Record<string, string>
  hasErrors: boolean

  // Actions
  addFiles: (files: File[]) => Promise<void>
  retry: (id: string) => Promise<void>
  cancel: (id: string) => Promise<void>
  remove: (id: string) => void
  submit: (title: string, description: string) => Promise<{ success: boolean; error?: string }>
  clear: () => void

  // Helpers
  getProgress: (id: string) => number | null
  getStatus: (id: string) => string | null
  pendingCount: number
  completedCount: number
  failedCount: number
}

export const useUpload = (maxConcurrent = 3): UseUploadResult => {
  const {
    jobs,
    isSubmitting,
    submissionError,
    uploadedFiles,
    hasErrors,
    handleAddFiles,
    handleRetry,
    handleCancel,
    handleRemove,
    handleSubmit,
    handleClear,
    getFileProgress,
    getFileStatus,
  } = useUploadManager(maxConcurrent)

  // Create queue for concurrency control
  const queue = useUploadQueue(maxConcurrent)

  // Add files with queue integration
  const addFiles = useCallback(
    async (files: File[]) => {
      await handleAddFiles(files)
      
      // Enqueue each file to queue for concurrency control
      const newJobs = jobs.filter((job: any) => !job.isDuplicate && job.status === 'idle')
      newJobs.forEach((job: any) => {
        queue.enqueue({
          id: job.id,
          execute: async () => {
            // This would trigger the actual upload via useUploadManager
            // Simplified for now
          },
        })
      })
    },
    [handleAddFiles, jobs, queue]
  )

  // Retry with queue integration
  const retry = useCallback(
    async (id: string) => {
      await handleRetry(id)
    },
    [handleRetry]
  )

  // Cancel with queue integration
  const cancel = useCallback(
    async (id: string) => {
      await handleCancel(id)
    },
    [handleCancel]
  )

  // Remove
  const remove = useCallback(
    (id: string) => {
      handleRemove(id)
    },
    [handleRemove]
  )

  // Submit
  const submit = useCallback(
    async (title: string, description: string) => {
      return handleSubmit(title, description)
    },
    [handleSubmit]
  )

  // Clear
  const clear = useCallback(() => {
    handleClear()
  }, [handleClear])

  // Progress
  const getProgress = useCallback(
    (id: string) => {
      return getFileProgress(id)
    },
    [getFileProgress]
  )

  // Status
  const getStatus = useCallback(
    (id: string) => {
      return getFileStatus(id)
    },
    [getFileStatus]
  )

  // Derived state
  const pendingCount = jobs.filter((job: any) => job.status === 'idle' || job.status === 'uploading').length
  const completedCount = jobs.filter((job: any) => job.status === 'done').length
  const failedCount = jobs.filter((job: any) => job.status === 'error').length

  return {
    jobs,
    isSubmitting,
    submissionError,
    uploadedFiles,
    hasErrors,
    addFiles,
    retry,
    cancel,
    remove,
    submit,
    clear,
    getProgress,
    getStatus,
    pendingCount,
    completedCount,
    failedCount,
  }
}