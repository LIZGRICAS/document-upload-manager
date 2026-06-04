/**
 * Domain Helpers for File Upload
 * 
 * Type guards and utility functions for UploadJob
 */

import type {
  UploadJob,
  IdleUploadJob,
  UploadingUploadJob,
  DoneUploadJob,
  ErrorUploadJob,
  CancelledUploadJob,
  DuplicateUploadJob,
} from '../types/upload.types'

// Exhaustiveness check
const assertNever = (value: never): never => {
  throw new Error(`Unexpected value: ${value}`)
}

// Type Guards
export const isUploading = (job: UploadJob): job is UploadingUploadJob =>
  job.status === 'uploading'

export const isDone = (job: UploadJob): job is DoneUploadJob =>
  job.status === 'done'

export const isError = (job: UploadJob): job is ErrorUploadJob =>
  job.status === 'error'

export const isCancelled = (job: UploadJob): job is CancelledUploadJob =>
  job.status === 'cancelled'

export const isIdle = (job: UploadJob): job is IdleUploadJob =>
  job.status === 'idle'

export const isDuplicate = (job: UploadJob): job is DuplicateUploadJob =>
  job.status === 'idle' && job.isDuplicate === true

// Progress helpers
export const getProgress = (job: UploadJob): number | null => {
  // Handle duplicate status - same as idle
  if (job.status === 'idle' && job.isDuplicate) {
    return null
  }
  
  switch (job.status) {
    case 'uploading':
      return job.progress
    case 'done':
      return 100
    case 'error':
    case 'cancelled':
      return job.progress
    case 'idle':
      return null
    default:
      return assertNever(job)
  }
}

export const getStatusText = (job: UploadJob): string => {
  // Handle duplicate status
  if (job.status === 'idle' && job.isDuplicate) {
    return 'Duplicado'
  }
  
  switch (job.status) {
    case 'uploading':
      return 'Subiendo'
    case 'done':
      return 'Completado'
    case 'error':
      return 'Error'
    case 'cancelled':
      return 'Cancelado'
    case 'idle':
      return 'Pendiente'
    default:
      return assertNever(job)
  }
}

// Time formatting
export const formatTimestamp = (date: Date): string => {
  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export const formatTimeAgo = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d atrás`
  if (hours > 0) return `${hours}h atrás`
  if (minutes > 0) return `${minutes}m atrás`
  return `${seconds}s atrás`
}

// File helpers
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

// File deduplication
export const getFileKey = (file: File): string => `${file.name}-${file.size}`