/**
 * FilesTable Component
 *
 * Columns: Options | Name | Mime Type | Tags* | Created At | Created By
 * Empty state: folder+magnifier icon, "No files uploaded"
 */

import React from 'react'
import type { UploadJob } from '../types/upload.types'
import { FileRow } from './FileRow'

interface FilesTableProps {
  jobs: UploadJob[]
  maxConcurrent: number
  onRemove: (id: string) => void
  onRetry: (id: string) => void
  onCancel: (id: string) => void
}

export const FilesTable: React.FC<FilesTableProps> = ({
  jobs,
  maxConcurrent,
  onRemove,
  onRetry,
  onCancel,
}) => {
  // Show all non-duplicate files
  const displayJobs = jobs.filter((job) => !job.isDuplicate)

  return (
    <div className="w-full overflow-x-auto">
      <table
        className="w-full text-sm border-collapse"
        role="table"
        aria-label="Lista de archivos subidos"
      >
        <thead>
          <tr className="border-b border-gray-200">
            <th scope="col" className="px-4 py-2 text-left text-sm font-semibold text-gray-700 w-16">
              Options
            </th>
            <th scope="col" className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Name
            </th>
            <th scope="col" className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Mime Type
            </th>
            <th scope="col" className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Tags <span className="text-red-500">*</span>
            </th>
            <th scope="col" className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Created At
            </th>
            <th scope="col" className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
              Created By
            </th>
          </tr>
        </thead>

        <tbody>
          {displayJobs.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-10 text-center">
                <div className="flex flex-col items-center gap-2">
                  {/* Folder + magnifier icon in yellow */}
                  <svg
                    className="w-14 h-14"
                    viewBox="0 0 64 64"
                    aria-hidden="true"
                  >
                    <path
                      d="M56 14H32l-4-6H8a4 4 0 00-4 4v36a4 4 0 004 4h48a4 4 0 004-4V18a4 4 0 00-4-4z"
                      fill="#FBBF24"
                    />
                    <circle cx="36" cy="34" r="8" fill="white" opacity="0.85" />
                    <circle cx="36" cy="34" r="6" fill="none" stroke="#D97706" strokeWidth="2" />
                    <line x1="40.5" y1="38.5" x2="46" y2="44" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                  <span className="text-sm text-gray-500">No files uploaded</span>
                </div>
              </td>
            </tr>
          ) : (
            displayJobs.map((job) => (
              <FileRow
                key={job.id}
                job={job}
                onRemove={onRemove}
                onRetry={onRetry}
                onCancel={onCancel}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
