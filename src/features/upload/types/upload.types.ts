/**
 * Domain Types for File Upload Feature
 * 
 * Discriminated unions for type-safe state management
 */

export type UploadStatus = 'idle' | 'uploading' | 'done' | 'error' | 'cancelled'

export interface BaseUploadJob {
  id: string
  file: File
  status: UploadStatus
  createdAt: Date
  retryCount: number
}

export interface IdleUploadJob extends BaseUploadJob {
  status: 'idle'
  progress?: never
  error?: never
  url?: never
  isDuplicate: false
}

export interface UploadingUploadJob extends BaseUploadJob {
  status: 'uploading'
  progress: number
  error?: never
  url?: never
  isDuplicate: false
}

export interface DoneUploadJob extends BaseUploadJob {
  status: 'done'
  progress: number
  error?: never
  url: string
  isDuplicate: false
}

export interface ErrorUploadJob extends BaseUploadJob {
  status: 'error'
  progress: number
  error: string
  url?: never
  isDuplicate: false
}

export interface CancelledUploadJob extends BaseUploadJob {
  status: 'cancelled'
  progress: number
  error?: never
  url?: never
  isDuplicate: false
}

export interface DuplicateUploadJob extends BaseUploadJob {
  status: 'idle'
  progress?: never
  error?: never
  url?: never
  isDuplicate: true
  originalFileId: string
}

export type UploadJob = 
  | IdleUploadJob 
  | UploadingUploadJob 
  | DoneUploadJob 
  | ErrorUploadJob 
  | CancelledUploadJob 
  | DuplicateUploadJob

// Upload Response from API
export interface UploadResponse {
  url: string
  id: string
}

// Upload Error types
export type UploadError = 
  | 'NETWORK_ERROR'
  | 'UNAUTHORIZED'
  | 'FILE_TOO_LARGE'
  | 'INVALID_FILE_TYPE'
  | 'SERVER_ERROR'
  | 'UPLOAD_CANCELLED'
  | `HTTP_${number}`
  | string

// File Descriptor for internal use
export interface FileDescriptor {
  id: string
  name: string
  size: number
  type: string
  lastModified: number
}
