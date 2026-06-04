/**
 * UploadForm Component
 *
 * Maintains full functionality (Formik validation, submit, clear, error handling)
 * while matching the visual reference: Dropzone + FilesTable layout
 */

import React, { useCallback } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as yup from 'yup'
import { useUploadManager } from '../hooks/useUploadManager'
import { FilesTable } from './FilesTable'
import { Dropzone } from './Dropzone'

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
    handleRemove,
    handleRetry,
    handleCancel,
    hasErrors,
  } = useUploadManager(3)

  const handleFormSubmit = useCallback(
    async (values: { title: string; description: string }) => {
      const result = await handleSubmit(values.title, values.description)
      if (result.success && onSubmit) {
        onSubmit({
          title: values.title,
          description: values.description,
          files: jobs
            .filter((j: any) => !j.isDuplicate && j.status === 'done')
            .map((j: any) => ({ id: j.id, url: j.url })),
        })
      }
    },
    [handleSubmit, onSubmit, jobs]
  )

  return (
    <Formik
      initialValues={{ title: '', description: '' }}
      validationSchema={formSchema}
      onSubmit={handleFormSubmit}
      enableReinitialize
    >
      {({ isSubmitting: formSubmitting, isValid, dirty }) => (
        <Form className="space-y-6">

          {/* Metadata fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Título <span className="text-red-500">*</span>
              </label>
              <Field
                id="title"
                name="title"
                type="text"
                className="block w-full rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Ingresa el título"
              />
              <ErrorMessage name="title" component="p" className="mt-1 text-xs text-red-500" />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción <span className="text-red-500">*</span>
              </label>
              <Field
                id="description"
                name="description"
                as="textarea"
                rows={2}
                className="block w-full rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Ingresa la descripción"
              />
              <ErrorMessage name="description" component="p" className="mt-1 text-xs text-red-500" />
            </div>
          </div>

          {/* Dropzone */}
          <Dropzone
            onFilesAdded={handleAddFiles}
            maxFiles={10}
            acceptedTypes="pdf"
          />

          {/* Files Table */}
          <FilesTable
            jobs={jobs}
            maxConcurrent={3}
            onRemove={handleRemove}
            onRetry={handleRetry}
            onCancel={handleCancel}
          />

          {/* Submission error */}
          {submissionError && (
            <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submissionError}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClear}
              className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Limpiar
            </button>
            <button
              type="submit"
              disabled={formSubmitting || isSubmitting || !isValid || !dirty || hasErrors}
              className={`rounded px-6 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2
                ${formSubmitting || isSubmitting || !isValid || !dirty || hasErrors
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                }`}
            >
              {formSubmitting || isSubmitting ? 'Enviando...' : 'Enviar'}
            </button>
          </div>

        </Form>
      )}
    </Formik>
  )
}
