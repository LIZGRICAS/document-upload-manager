/**
 * Upload Selectors
 * 
 * Computed derived state from UploadJob[]
 * Follows Redux selector pattern
 */

import type { UploadJob } from '../types/upload.types'

export const getJobs = (jobs: UploadJob[]): UploadJob[] => jobs

export const getIdleJobs = (jobs: UploadJob[]): UploadJob[] =>
  jobs.filter((job) => job.status === 'idle')

export const getUploadingJobs = (jobs: UploadJob[]): UploadJob[] =>
  jobs.filter((job) => job.status === 'uploading')

export const getDoneJobs = (jobs: UploadJob[]): UploadJob[] =>
  jobs.filter((job) => job.status === 'done')

export const getErrorJobs = (jobs: UploadJob[]): UploadJob[] =>
  jobs.filter((job) => job.status === 'error')

export const getCancelledJobs = (jobs: UploadJob[]): UploadJob[] =>
  jobs.filter((job) => job.status === 'cancelled')

export const getDuplicateJobs = (jobs: UploadJob[]): UploadJob[] =>
  jobs.filter((job) => job.isDuplicate)

export const getProgress = (jobs: UploadJob[]): Record<string, number> => {
  const progress: Record<string, number> = {}
  for (const job of jobs) {
    if (job.status === 'uploading' || job.status === 'error' || job.status === 'cancelled') {
      progress[job.id] = job.progress
    }
  }
  return progress
}

export const getStatusCounts = (jobs: UploadJob[]): Record<string, number> => {
  const counts: Record<string, number> = {
    idle: 0,
    uploading: 0,
    done: 0,
    error: 0,
    cancelled: 0,
    duplicate: 0,
  }

  for (const job of jobs) {
    if (job.isDuplicate) {
      counts.duplicate = (counts.duplicate ?? 0) + 1
    } else if (job.status in counts) {
      counts[job.status] = (counts[job.status] ?? 0) + 1
    }
  }

  return counts
}

export const getAllCompleted = (jobs: UploadJob[]): boolean => {
  const nonDuplicateJobs = jobs.filter((job) => !job.isDuplicate)
  if (nonDuplicateJobs.length === 0) return false
  return nonDuplicateJobs.every((job) => job.status === 'done')
}

export const getPendingCount = (jobs: UploadJob[]): number =>
  jobs.filter((job) => job.status === 'idle' || job.status === 'uploading').length

export const getCompletedCount = (jobs: UploadJob[]): number =>
  jobs.filter((job) => job.status === 'done').length

export const getFailedCount = (jobs: UploadJob[]): number =>
  jobs.filter((job) => job.status === 'error').length

export const getHasErrors = (jobs: UploadJob[]): boolean =>
  jobs.some((job) => job.status === 'error')

export const getIsUploading = (jobs: UploadJob[]): boolean =>
  jobs.some((job) => job.status === 'uploading')

// Find job by ID
export const findJobById = (jobs: UploadJob[], id: string): UploadJob | undefined =>
  jobs.find((job) => job.id === id)

// Find first error job
export const findFirstErrorJob = (jobs: UploadJob[]): UploadJob | undefined =>
  jobs.find((job) => job.status === 'error')

// Calculate average progress
export const getAverageProgress = (jobs: UploadJob[]): number => {
  const uploadingJobs = getUploadingJobs(jobs)
  if (uploadingJobs.length === 0) {
    const completedJobs = getDoneJobs(jobs)
    return completedJobs.length > 0 ? 100 : 0
  }

  const totalProgress = uploadingJobs.reduce((sum, job) => sum + (job.progress || 0), 0)
  return Math.round(totalProgress / uploadingJobs.length)
}

// Check if all uploads are complete (including duplicates)
export const isUploadComplete = (jobs: UploadJob[]): boolean => {
  const nonDuplicateJobs = jobs.filter((job) => !job.isDuplicate)
  return nonDuplicateJobs.every((job) => job.status === 'done')
}