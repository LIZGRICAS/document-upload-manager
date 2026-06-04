/**
 * FilesTable Component
 * 
 * Enterprise-style table for displaying uploaded files
 * Columns: Actions | Name | MIME Type | Status | Progress | Created At | Created By
 */

import React from 'react'
import type { UploadJob } from '../types/upload.types'
import { useUploadContext } from '../store'
import { FileRow } from './FileRow'
import { formatTimestamp } from '../domain'

interface FilesTableProps {
  jobs: UploadJob[]
  maxConcurrent: number
}

export const FilesTable: React.FC<FilesTableProps> = ({ jobs, maxConcurrent }) => {
  const { removeFile, startUpload, cancelUpload, retryUpload, clearFiles } = useUploadContext()

  // Filter out duplicates for display (but keep them in state)
  const displayJobs = jobs.filter((job) => !job.isDuplicate)

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full caption-bottom" role="table" aria-label="Lista de archivos subidos">
        <caption className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Lista de archivos subidos. Acciones disponibles: cancelar, reintentar, eliminar.
        </caption>
        
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo MIME
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Progreso
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Creado El
            </th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Creado Por
            </th>
          </tr>
        </thead>
        
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700" role="rowgroup">
          {displayJobs.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                No hay archivos. Arrastra archivos aquí para comenzar.
              </td>
            </tr>
          ) : (
            displayJobs.map((job) => (
              <FileRow
                key={job.id}
                job={job}
                onRemove={removeFile}
                onStart={startUpload}
                onCancel={cancelUpload}
                onRetry={retryUpload}
              />
            ))
          )}
        </tbody>
      </table>

      {/* Clear all button */}
      {jobs.length > 0 && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={clearFiles}
            className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            Limpiar todo
          </button>
        </div>
      )}
    </div>
  )
}