/**
 * NameCell Component
 * 
 * Displays file name with tooltip
 */

import React, { useState } from 'react'
import type { UploadJob } from '../types/upload.types'

interface NameCellProps {
  job: UploadJob
}

export const NameCell: React.FC<NameCellProps> = ({ job }) => {
  const [showTooltip, setShowTooltip] = useState(false)

  const fileName = job.file.name
  const shortName = fileName.length > 30 ? `${fileName.substring(0, 27)}...` : fileName

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="max-w-[200px] truncate font-medium text-gray-900 dark:text-gray-100">
        {shortName}
      </div>
      {showTooltip && (
        <div
          className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap"
          role="tooltip"
        >
          {fileName}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  )
}