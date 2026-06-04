/**
 * UploadForm Component
 * 
 * Main form wrapper with Formik
 * Formik controls: title, description
 * UploadContext controls: files (upload jobs)
 */

import React, { useState, useCallback } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as yup from 'yup'
import { useUploadManager } from '../hooks/useUploadManager'
// Config values (hardcoded for now)
const MAX_CONCURRENT = 3
const MAX_FILES = 10
const MIN_TITLE_LENGTH = 3
const MAX_TITLE_LENGTH = 100
const MIN_DESCRIPTION_LENGTH = 10
const MAX_DESCRIPTION_LENGTH = 500
import { FilesTable } from './FilesTable'
import { Dropzone } from './Dropzone'

// Formik validation schema
const formSchema = yup.object({
  title: yup
    .string()
    .required('El título es requerido')
    .min(3, 'Mínimo 3 caracteres')
    .max(100, 'Máximo 100 caracteres'),
  
  description: yup
    .string()
    .required('La descripción es requerida')
    .min(10, 'Mínimo 10 caracteres')
    .max(500, 'Máximo 500 caracteres'),
})

export interface UploadFormProps {
  onSubmit?: (data: { title: string; description: string; files: any[] }) => void
}

export const UploadForm: React.FC<UploadFormProps> = ({ onSubmit }) => {
  const {
    jobs,
    isSubmitting,
    submissionError,
    handleAddFiles,
    handleSubmit,
    handleClear,
    hasErrors,
    getFileProgress,
  } = useUploadManager(3)

  const [formValues, setFormValues] = useState({ title: '', description: '' })

  const handleFormSubmit = useCallback(
    async (values: { title: string; description: string }) => {
      setFormValues(values)
      const result = await handleSubmit(values.title, values.description)
      if (result.success && onSubmit) {
        onSubmit({
          title: values.title,
          description: values.description,
          files: jobs.filter((j: any) => !j.isDuplicate && j.status === 'done').map((j: any) => ({
            id: j.id,
            url: j.url,
          })),
        })
      }
    },
    [handleSubmit, onSubmit, jobs]
  )

  const handleFilesAdded = useCallback(
    (files: File[]) => {
      handleAddFiles(files)
    },
    [handleAddFiles]
  )

  // Calculate upload progress for all files
  const totalProgress = jobs.length > 0 ? Math.round(
    jobs.reduce((sum, job: any) => sum + (job.progress || 0), 0) / jobs.length
  ) : 0

  return (
    <Formik
      initialValues={{
        title: '',
        description: '',
      }}
      validationSchema={formSchema}
      onSubmit={handleFormSubmit}
      enableReinitialize
    >
      {({ isSubmitting: formSubmitting, isValid, dirty }) => (
        <Form className="space-y-6">
          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Título *
              </label>
              <Field
                id="title"
                name="title"
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:text-sm px-3 py-2"
                placeholder="Ingresa el título"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="mt-1 text-xs text-red-600 dark:text-red-400"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Descripción *
              </label>
              <Field
                id="description"
                name="description"
                as="textarea"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white sm:text-sm px-3 py-2"
                placeholder="Ingresa la descripción"
              />
              <ErrorMessage
                name="description"
                component="div"
                className="mt-1 text-xs text-red-600 dark:text-red-400"
              />
            </div>
          </div>

          {/* Dropzone */}
          <Dropzone
            onFilesAdded={handleFilesAdded}
            maxFiles={10}
            isUploading={hasErrors}
          />

          {/* Files Table */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Archivos en cola
            </h3>
            <FilesTable
              jobs={jobs}
              maxConcurrent={3}
            />
          </div>

          {/* Submission Error */}
          {submissionError && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    <p>{submissionError}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Limpiar
            </button>
            <button
              type="submit"
              disabled={
                formSubmitting ||
                isSubmitting ||
                !isValid ||
                !dirty ||
                hasErrors
              }
              className={`
                px-6 py-2 text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2
                ${
                  formSubmitting ||
                  isSubmitting ||
                  !isValid ||
                  !dirty ||
                  hasErrors
                    ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
                }
              `}
            >
              {formSubmitting || isSubmitting ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}