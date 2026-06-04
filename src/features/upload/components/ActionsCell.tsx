/**
 * ActionsCell Component
 * 
 * Action buttons: Cancel (uploading), Retry (error), Remove (all)
 */

import React from 'react'
import type { UploadJob } from '../types/upload.types'
import { isUploading, isError, isIdle, isDone, isCancelled } from '../domain'

interface ActionsCellProps {
  job: UploadJob
  onRemove: (id: string) => void
  onStart: (id: string) => void
  onCancel: (id: string) => void
  onRetry: (id: string) => void
}

export const ActionsCell: React.FC<ActionsCellProps> = ({
  job,
  onRemove,
  onStart,
  onCancel,
  onRetry,
}) => {
  const handleRetry = (e: React.MouseEvent) => {
    e.stopPropagation()
    onRetry(job.id)
  }

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation()
    onCancel(job.id)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onRemove(job.id)
  }

  const handleStart = (e: React.MouseEvent) => {
    e.stopPropagation()
    onStart(job.id)
  }

  return (
    <div className="flex items-center space-x-2" role="cell">
      {isError(job) && (
        <button
          onClick={handleRetry}
          className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded"
          aria-label={`Reintentar upload para ${job.file.name}`}
        >
          <svg
            className="w-3 h-3 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Reintentar
        </button>
      )}

      {isUploading(job) && (
        <button
          onClick={handleCancel}
          className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
          aria-label={`Cancelar upload para ${job.file.name}`}
        >
          <svg
            className="w-3 h-3 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Cancelar
        </button>
      )}

      {(isIdle(job) || isCancelled(job)) && (
        <button
          onClick={handleStart}
          className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          aria-label={`Iniciar upload para ${job.file.name}`}
        >
          <svg
            className="w-3 h-3 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Subir
        </button>
      )}

      <button
        onClick={handleRemove}
        className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
        aria-label={`Eliminar archivo ${job.file.name}`}
      >
        <svg
          className="w-3 h-3 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        Eliminar
      </button>
    </div>
  )
}