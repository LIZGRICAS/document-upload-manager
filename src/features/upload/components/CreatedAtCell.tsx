/**
 * CreatedAtCell Component
 * 
 * Displays creation timestamp
 */

import React from 'react'
import type { UploadJob } from '../types/upload.types'
import { formatTimestamp } from '../domain'

interface CreatedAtCellProps {
  job: UploadJob
}

export const CreatedAtCell: React.FC<CreatedAtCellProps> = ({ job }) => {
  return (
    <div className="text-sm text-gray-600 dark:text-gray-400" role="cell">
      {formatTimestamp(job.createdAt)}
    </div>
  )
}