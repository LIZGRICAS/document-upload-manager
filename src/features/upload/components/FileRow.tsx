/**
 * FileRow Component
 * 
 * Single row in FilesTable
 */

import React from 'react'
import type { UploadJob } from '../types/upload.types'
import { ActionsCell } from './ActionsCell'
import { NameCell } from './NameCell'
import { MimeCell } from './MimeCell'
import { StatusCell } from './StatusCell'
import { ProgressCell } from './ProgressCell'
import { CreatedAtCell } from './CreatedAtCell'
import { CreatedByCell } from './CreatedByCell'

interface FileRowProps {
  job: UploadJob
  onRemove: (id: string) => void
  onStart: (id: string) => void
  onCancel: (id: string) => void
  onRetry: (id: string) => void
}

export const FileRow: React.FC<FileRowProps> = ({
  job,
  onRemove,
  onStart,
  onCancel,
  onRetry,
}) => {
  return (
    <tr role="row" className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <td role="cell" className="px-4 py-3 whitespace-nowrap">
        <ActionsCell
          job={job}
          onRemove={onRemove}
          onStart={onStart}
          onCancel={onCancel}
          onRetry={onRetry}
        />
      </td>
      <td role="cell" className="px-4 py-3 whitespace-nowrap">
        <NameCell job={job} />
      </td>
      <td role="cell" className="px-4 py-3 whitespace-nowrap">
        <MimeCell job={job} />
      </td>
      <td role="cell" className="px-4 py-3 whitespace-nowrap">
        <StatusCell job={job} />
      </td>
      <td role="cell" className="px-4 py-3">
        <ProgressCell job={job} />
      </td>
      <td role="cell" className="px-4 py-3 whitespace-nowrap">
        <CreatedAtCell job={job} />
      </td>
      <td role="cell" className="px-4 py-3 whitespace-nowrap">
        <CreatedByCell />
      </td>
    </tr>
  )
}