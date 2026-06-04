/**
 * MimeCell Component
 * 
 * Displays MIME type
 */

import React from 'react'
import type { UploadJob } from '../types/upload.types'

interface MimeCellProps {
  job: UploadJob
}

export const MimeCell: React.FC<MimeCellProps> = ({ job }) => {
  const mimeType = job.file.type || 'application/octet-stream'

  // Get file extension for display
  const extension = job.file.name.split('.').pop()?.toLowerCase() || 'unknown'

  return (
    <div className="text-sm text-gray-600 dark:text-gray-400 font-mono">
      {mimeType.toLowerCase()} <span className="text-gray-400 dark:text-gray-500 text-xs">({extension})</span>
    </div>
  )
}