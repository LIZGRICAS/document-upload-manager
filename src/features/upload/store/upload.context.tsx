/**
 * Upload Context
 * 
 * Global state for file uploads
 * ONLY manages state, NO business logic
 */

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
} from 'react'
import type { UploadJob } from '../types/upload.types'
import type {
  UploadAction,
  AddFilesAction,
  RemoveFileAction,
  ClearFilesAction,
  StartUploadAction,
  StartAllUploadsAction,
  SetProgressAction,
  SetCompletedAction,
  SetErrorAction,
  CancelUploadAction,
  SetCancelledAction,
  RetryUploadAction,
} from './upload.actions'
import { uploadReducer } from './upload.reducer'

// Context type
interface UploadContextType {
  jobs: UploadJob[]
  addFiles: (files: File[]) => void
  removeFile: (id: string) => void
  clearFiles: () => void
  startUpload: (id: string) => void
  startAllUploads: () => void
  setProgress: (id: string, progress: number) => void
  setCompleted: (id: string, url: string) => void
  setError: (id: string, error: string) => void
  cancelUpload: (id: string) => void
  retryUpload: (id: string) => void
  isUploading: boolean
  pendingCount: number
  completedCount: number
  failedCount: number
  hasErrors: boolean
}

const UploadContext = createContext<UploadContextType | undefined>(undefined)

export const UploadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(uploadReducer, {
    jobs: [],
  })

  // Action dispatchers
  const addFiles = useCallback((files: File[]) => {
    dispatch({ type: 'ADD_FILES', payload: { files } })
  }, [])

  const removeFile = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_FILE', payload: { id } })
  }, [])

  const clearFiles = useCallback(() => {
    dispatch({ type: 'CLEAR_FILES' })
  }, [])

  const startUpload = useCallback((id: string) => {
    dispatch({ type: 'START_UPLOAD', payload: { id } })
  }, [])

  const startAllUploads = useCallback(() => {
    dispatch({ type: 'START_ALL_UPLOADS' })
  }, [])

  const setProgress = useCallback((id: string, progress: number) => {
    dispatch({ type: 'SET_PROGRESS', payload: { id, progress } })
  }, [])

  const setCompleted = useCallback((id: string, url: string) => {
    dispatch({ type: 'SET_COMPLETED', payload: { id, url } })
  }, [])

  const setError = useCallback((id: string, error: string) => {
    dispatch({ type: 'SET_ERROR', payload: { id, error } })
  }, [])

  const cancelUpload = useCallback((id: string) => {
    dispatch({ type: 'CANCEL_UPLOAD', payload: { id } })
  }, [])

  const retryUpload = useCallback((id: string) => {
    dispatch({ type: 'RETRY_UPLOAD', payload: { id } })
  }, [])

  // Derived state
  const isUploading = useMemo(
    () => state.jobs.some((job) => job.status === 'uploading'),
    [state.jobs]
  )

  const pendingCount = useMemo(
    () => state.jobs.filter((job) => job.status === 'idle' || job.status === 'uploading').length,
    [state.jobs]
  )

  const completedCount = useMemo(
    () => state.jobs.filter((job) => job.status === 'done').length,
    [state.jobs]
  )

  const failedCount = useMemo(
    () => state.jobs.filter((job) => job.status === 'error').length,
    [state.jobs]
  )

  const hasErrors = useMemo(
    () => state.jobs.some((job) => job.status === 'error'),
    [state.jobs]
  )

  return (
    <UploadContext.Provider
      value={{
        jobs: state.jobs,
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
        isUploading,
        pendingCount,
        completedCount,
        failedCount,
        hasErrors,
      }}
    >
      {children}
    </UploadContext.Provider>
  )
}

export const useUploadContext = (): UploadContextType => {
  const context = useContext(UploadContext)
  if (context === undefined) {
    throw new Error('useUploadContext must be used within UploadProvider')
  }
  return context
}

// Hooks for derived state
export const useUploadJobs = (): UploadJob[] => {
  const { jobs } = useUploadContext()
  return jobs
}

export const usePendingCount = (): number => {
  const { pendingCount } = useUploadContext()
  return pendingCount
}

export const useCompletedCount = (): number => {
  const { completedCount } = useUploadContext()
  return completedCount
}

export const useFailedCount = (): number => {
  const { failedCount } = useUploadContext()
  return failedCount
}

export const useHasErrors = (): boolean => {
  const { hasErrors } = useUploadContext()
  return hasErrors
}