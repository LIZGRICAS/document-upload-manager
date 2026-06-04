/**
 * ProgressCell Component
 * 
 * Displays progress bar for uploading jobs
 */

import React from 'react'
import type { UploadJob } from '../types/upload.types'
import { getProgress } from '../domain'

interface ProgressCellProps {
  job: UploadJob
}

export const ProgressCell: React.FC<ProgressCellProps> = ({ job }) => {
  const progress = getProgress(job)

  if (progress === null) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400" role="cell">
        -
      </div>
    )
  }

  return (
    <div className="w-full max-w-[120px]" role="cell">
      <div className="flex items-center space-x-2">
        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div
            className={`h-2 rounded-full transition-all duration-200 ${
              progress === 100
                ? 'bg-green-500'
                : job.status === 'error'
                ? 'bg-red-500'
                : job.status === 'cancelled'
                ? 'bg-gray-400'
                : 'bg-blue-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 min-w-[3rem]">
          {progress}%
        </span>
      </div>
    </div>
  )
}