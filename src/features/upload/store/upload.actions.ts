/**
 * Upload Actions for Reducer
 * 
 * Exhaustive list of all state-changing actions
 * Follows FSA (Flux Standard Action) pattern
 */

import type { UploadJob } from '../types/upload.types'

// File-related actions
export const ADD_FILES = 'ADD_FILES' as const
export const REMOVE_FILE = 'REMOVE_FILE' as const
export const CLEAR_FILES = 'CLEAR_FILES' as const

// Upload lifecycle actions
export const START_UPLOAD = 'START_UPLOAD' as const
export const START_ALL_UPLOADS = 'START_ALL_UPLOADS' as const
export const SET_PROGRESS = 'SET_PROGRESS' as const
export const SET_COMPLETED = 'SET_COMPLETED' as const
export const SET_ERROR = 'SET_ERROR' as const

// Cancellation actions
export const CANCEL_UPLOAD = 'CANCEL_UPLOAD' as const
export const SET_CANCELLED = 'SET_CANCELLED' as const

// Retry actions
export const RETRY_UPLOAD = 'RETRY_UPLOAD' as const

// Configuration actions
export const SET_MAX_CONCURRENT = 'SET_MAX_CONCURRENT' as const

// All actions type
export const UploadActionType = {
  ADD_FILES,
  REMOVE_FILE,
  CLEAR_FILES,
  START_UPLOAD,
  START_ALL_UPLOADS,
  SET_PROGRESS,
  SET_COMPLETED,
  SET_ERROR,
  CANCEL_UPLOAD,
  SET_CANCELLED,
  RETRY_UPLOAD,
  SET_MAX_CONCURRENT,
} as const

export type UploadActionType = typeof UploadActionType[keyof typeof UploadActionType]

// Action interfaces
export interface AddFilesAction {
  type: typeof ADD_FILES
  payload: {
    files: File[]
  }
}

export interface RemoveFileAction {
  type: typeof REMOVE_FILE
  payload: {
    id: string
  }
}

export interface ClearFilesAction {
  type: typeof CLEAR_FILES
}

export interface StartUploadAction {
  type: typeof START_UPLOAD
  payload: {
    id: string
  }
}

export interface StartAllUploadsAction {
  type: typeof START_ALL_UPLOADS
}

export interface SetProgressAction {
  type: typeof SET_PROGRESS
  payload: {
    id: string
    progress: number
  }
}

export interface SetCompletedAction {
  type: typeof SET_COMPLETED
  payload: {
    id: string
    url: string
  }
}

export interface SetErrorAction {
  type: typeof SET_ERROR
  payload: {
    id: string
    error: string
  }
}

export interface CancelUploadAction {
  type: typeof CANCEL_UPLOAD
  payload: {
    id: string
  }
}

export interface SetCancelledAction {
  type: typeof SET_CANCELLED
  payload: {
    id: string
  }
}

export interface RetryUploadAction {
  type: typeof RETRY_UPLOAD
  payload: {
    id: string
  }
}

export interface SetMaxConcurrentAction {
  type: typeof SET_MAX_CONCURRENT
  payload: {
    maxConcurrent: number
  }
}

export type UploadAction =
  | AddFilesAction
  | RemoveFileAction
  | ClearFilesAction
  | StartUploadAction
  | StartAllUploadsAction
  | SetProgressAction
  | SetCompletedAction
  | SetErrorAction
  | CancelUploadAction
  | SetCancelledAction
  | RetryUploadAction
  | SetMaxConcurrentAction

// Exhaustiveness check
export const assertNever = (value: never): never => {
  throw new Error(`Unexpected action: ${value}`)
}