/**
 * FileRow Component
 *
 * Columns: Options | Name | Mime Type | Tags (dropdown) | Created At | Created By
 * Options: trash icon always visible; retry/cancel shown by status
 */

import React from 'react'
import type { UploadJob } from '../types/upload.types'
import { isUploading, isError, isDone } from '../domain'

interface FileRowProps {
  job: UploadJob
  onRemove: (id: string) => void
  onRetry: (id: string) => void
  onCancel: (id: string) => void
}

const TAG_OPTIONS = ['Contrato', 'Factura', 'Reporte', 'Presentación', 'Manual', 'Otro']

export const FileRow: React.FC<FileRowProps> = ({ job, onRemove, onRetry, onCancel }) => {
  const mimeType = job.file.type || 'application/octet-stream'

  const date = new Date(job.createdAt)
  const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors" role="row">
      {/* Options */}
      <td className="px-4 py-2 w-20" role="cell">
        <div className="flex items-center gap-1">
          {/* Retry button — only on error */}
          {isError(job) && (
            <button
              onClick={() => onRetry(job.id)}
              title="Reintentar"
              className="text-green-600 hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-green-400 rounded"
              aria-label={`Reintentar ${job.file.name}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          )}

          {/* Cancel button — only while uploading */}
          {isUploading(job) && (
            <button
              onClick={() => onCancel(job.id)}
              title="Cancelar"
              className="text-orange-500 hover:text-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-400 rounded"
              aria-label={`Cancelar ${job.file.name}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Delete — always visible */}
          <button
            onClick={() => onRemove(job.id)}
            title="Eliminar"
            className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
            aria-label={`Eliminar ${job.file.name}`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </td>

      {/* Name — blue link style */}
      <td className="px-4 py-2" role="cell">
        <span
          className="text-blue-600 hover:underline cursor-pointer text-sm block truncate max-w-[200px]"
          title={job.file.name}
        >
          {job.file.name}
        </span>
        {/* Show progress inline if uploading */}
        {isUploading(job) && (
          <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-blue-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${job.progress}%` }}
              role="progressbar"
              aria-valuenow={job.progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        )}
        {/* Error message */}
        {isError(job) && (
          <span className="text-xs text-red-500 mt-0.5 block">{job.error}</span>
        )}
      </td>

      {/* Mime Type */}
      <td className="px-4 py-2 text-sm text-gray-700" role="cell">
        {mimeType}
      </td>

      {/* Tags dropdown */}
      <td className="px-4 py-2" role="cell">
        <div className="relative inline-block">
          <select
            defaultValue=""
            className="appearance-none text-sm text-gray-500 border border-gray-300 rounded px-2 py-1 pr-6 bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 w-36"
            aria-label="Seleccionar tag"
          >
            <option value="" disabled>Seleccionar...</option>
            {TAG_OPTIONS.map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </td>

      {/* Created At */}
      <td className="px-4 py-2" role="cell">
        <div className="flex items-center gap-1 text-sm text-gray-700">
          <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formattedDate}
        </div>
      </td>

      {/* Created By */}
      <td className="px-4 py-2" role="cell">
        <div className="flex items-center gap-1 text-sm text-gray-700">
          <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          User Test 4
        </div>
      </td>
    </tr>
  )
}
