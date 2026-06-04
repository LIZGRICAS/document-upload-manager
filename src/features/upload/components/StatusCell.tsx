/**
 * StatusCell Component
 * 
 * Displays status with color-coded badge
 */

import React from 'react'
import type { UploadJob } from '../types/upload.types'
import { getStatusText, isDuplicate } from '../domain'

interface StatusCellProps {
  job: UploadJob
}

export const StatusCell: React.FC<StatusCellProps> = ({ job }) => {
  const statusText = getStatusText(job)
  const isDup = isDuplicate(job)

  // Determine badge color based on status
  const getStatusColor = () => {
    if (isDup) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    switch (job.status) {
      case 'idle':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
      case 'uploading':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'done':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'cancelled':
        return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}
      role="status"
      aria-live="polite"
    >
      {statusText}
    </span>
  )
}