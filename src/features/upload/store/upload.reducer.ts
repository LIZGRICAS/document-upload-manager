/**
 * Upload Reducer
 * 
 * Manages state transitions for UploadJob objects
 * Single source of truth for file upload state
 */

import type { UploadJob, UploadStatus } from '../types/upload.types'
import type {
  UploadAction,
  UploadActionType,
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
import { assertNever } from './upload.actions'

export interface UploadState {
  jobs: UploadJob[]
}

const initialState: UploadState = {
  jobs: [],
}

/**
 * Update a single job in the array
 */
const updateJob = (
  jobs: UploadJob[],
  id: string,
  updater: (job: UploadJob) => any
): UploadJob[] => {
  return jobs.map((job) => {
    if (job.id === id) {
      return updater(job)
    }
    return job
  })
}

/**
 * Add files to the state (mark as idle, check for duplicates)
 */
const addFiles = (
  state: UploadState,
  files: File[]
): UploadState => {
  const existingFiles = new Map<string, UploadJob>()
  const newJobs: UploadJob[] = []

  // Build lookup map of existing files
  for (const job of state.jobs) {
    if (!job.isDuplicate) {
      existingFiles.set(`${job.file.name}-${job.file.size}`, job)
    }
  }

  // Add new files
  for (const file of files) {
    const key = `${file.name}-${file.size}`
    const existing = existingFiles.get(key)

    if (existing) {
      // Duplicate detected
      newJobs.push({
        id: crypto.randomUUID(),
        file,
        status: 'idle',
        createdAt: new Date(),
        retryCount: 0,
        isDuplicate: true,
        originalFileId: existing.id,
        // Required by discriminated union - never types
        progress: undefined as never,
        error: undefined as never,
        url: undefined as never,
      })
    } else {
      // New file
      newJobs.push({
        id: crypto.randomUUID(),
        file,
        status: 'idle',
        createdAt: new Date(),
        retryCount: 0,
        isDuplicate: false,
        // Required by discriminated union - never types
        progress: undefined as never,
        error: undefined as never,
        url: undefined as never,
      })
      const lastJob = newJobs[newJobs.length - 1]
      if (lastJob) {
        existingFiles.set(key, lastJob)
      }
    }
  }

  return {
    ...state,
    jobs: [...state.jobs, ...newJobs],
  }
}

/**
 * Remove a file from the state
 */
const removeFile = (
  state: UploadState,
  id: string
): UploadState => {
  return {
    ...state,
    jobs: state.jobs.filter((job) => job.id !== id),
  }
}

/**
 * Clear all files from the state
 */
const clearFiles = (state: UploadState): UploadState => {
  return {
    ...state,
    jobs: [],
  }
}

/**
 * Start uploading a file
 */
const startUpload = (
  state: UploadState,
  id: string
): UploadState => {
  return {
    ...state,
    jobs: updateJob(state.jobs, id, (job) => {
      if (job.status === 'idle' || job.status === 'error' || job.status === 'cancelled') {
        return {
          ...job,
          status: 'uploading' as const,
          retryCount: job.retryCount + 1,
        } satisfies any
      }
      return job
    }),
  }
}

/**
 * Start all uploads
 */
const startAllUploads = (state: UploadState): UploadState => {
  return {
    ...state,
    jobs: state.jobs.map((job) => {
      if (job.status === 'idle' || job.status === 'error' || job.status === 'cancelled') {
        return {
          ...job,
          status: 'uploading' as const,
          retryCount: job.retryCount + 1,
        } satisfies any
      }
      return job
    }) satisfies any as UploadJob[],
  }
}

/**
 * Set upload progress
 */
const setProgress = (
  state: UploadState,
  id: string,
  progress: number
): UploadState => {
  return {
    ...state,
    jobs: updateJob(state.jobs, id, (job) => {
      if (job.status === 'uploading') {
        return {
          ...job,
          progress,
        } satisfies any
      }
      return job
    }),
  }
}

/**
 * Mark upload as completed
 */
const setCompleted = (
  state: UploadState,
  id: string,
  url: string
): UploadState => {
  return {
    ...state,
    jobs: updateJob(state.jobs, id, (job) => {
      if (job.status === 'uploading') {
        return {
          ...job,
          status: 'done' as const,
          progress: 100,
          url,
        } satisfies any
      }
      return job
    }),
  }
}

/**
 * Mark upload as failed
 */
const setError = (
  state: UploadState,
  id: string,
  error: string
): UploadState => {
  return {
    ...state,
    jobs: updateJob(state.jobs, id, (job) => {
      if (job.status === 'uploading') {
        return {
          ...job,
          status: 'error' as const,
          error,
        } satisfies any
      }
      return job
    }),
  }
}

/**
 * Cancel an upload
 */
const cancelUpload = (
  state: UploadState,
  id: string
): UploadState => {
  return {
    ...state,
    jobs: updateJob(state.jobs, id, (job) => {
      if (job.status === 'uploading') {
        return {
          ...job,
          status: 'cancelled' as const,
        } satisfies any
      }
      return job
    }),
  }
}

/**
 * Mark upload as cancelled
 */
const setCancelled = (
  state: UploadState,
  id: string
): UploadState => {
  return {
    ...state,
    jobs: updateJob(state.jobs, id, (job) => {
      if (job.status === 'uploading' || job.status === 'idle' || job.status === 'error') {
        return {
          ...job,
          status: 'cancelled' as const,
        } satisfies any
      }
      return job
    }),
  }
}

/**
 * Retry an upload
 */
const retryUpload = (
  state: UploadState,
  id: string
): UploadState => {
  return {
    ...state,
    jobs: updateJob(state.jobs, id, (job) => {
      if (job.status === 'error' || job.status === 'cancelled') {
        return {
          ...job,
          status: 'idle' as const,
          error: undefined as never,
          retryCount: job.retryCount + 1,
        } satisfies any
      }
      return job
    }),
  }
}

/**
 * Main reducer function
 */
export const uploadReducer = (
  state: UploadState = initialState,
  action: UploadAction
): UploadState => {
  switch (action.type) {
    case 'ADD_FILES':
      return addFiles(state, action.payload.files)
    case 'REMOVE_FILE':
      return removeFile(state, action.payload.id)
    case 'CLEAR_FILES':
      return clearFiles(state)
    case 'START_UPLOAD':
      return startUpload(state, action.payload.id)
    case 'START_ALL_UPLOADS':
      return startAllUploads(state)
    case 'SET_PROGRESS':
      return setProgress(state, action.payload.id, action.payload.progress)
    case 'SET_COMPLETED':
      return setCompleted(state, action.payload.id, action.payload.url)
    case 'SET_ERROR':
      return setError(state, action.payload.id, action.payload.error)
    case 'CANCEL_UPLOAD':
      return cancelUpload(state, action.payload.id)
    case 'SET_CANCELLED':
      return setCancelled(state, action.payload.id)
    case 'RETRY_UPLOAD':
      return retryUpload(state, action.payload.id)
    case 'SET_MAX_CONCURRENT':
      return state // Configuration handled elsewhere
    default:
      // This should never happen with proper exhaustiveness checking
      return state
  }
}
