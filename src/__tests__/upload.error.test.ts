/**
 * Tests for Upload Error Types
 * 
 * Tests typed error handling with UploadError class
 */

import { describe, it, expect } from '@jest/globals'

import {
  UploadErrorCode,
  UploadError,
  createNetworkError,
  createUnauthorizedError,
  createFileTooLargeError,
  createInvalidFileTypeError,
  createServerError,
  createAbortedError,
  createHttpError,
} from '../features/upload/types/upload.error'

describe('UploadErrorCode', () => {
  it('should have all error codes', () => {
    expect(UploadErrorCode.NETWORK).toBe('NETWORK')
    expect(UploadErrorCode.UNAUTHORIZED).toBe('UNAUTHORIZED')
    expect(UploadErrorCode.FILE_TOO_LARGE).toBe('FILE_TOO_LARGE')
    expect(UploadErrorCode.INVALID_FILE_TYPE).toBe('INVALID_FILE_TYPE')
    expect(UploadErrorCode.SERVER_ERROR).toBe('SERVER_ERROR')
    expect(UploadErrorCode.ABORTED).toBe('ABORTED')
    expect(UploadErrorCode.HTTP_400).toBe('HTTP_400')
    expect(UploadErrorCode.HTTP_401).toBe('HTTP_401')
    expect(UploadErrorCode.HTTP_413).toBe('HTTP_413')
    expect(UploadErrorCode.HTTP_500).toBe('HTTP_500')
    expect(UploadErrorCode.HTTP_UNKNOWN).toBe('HTTP_UNKNOWN')
  })
})

describe('UploadError', () => {
  it('should create error with code and message', () => {
    const error = new UploadError(UploadErrorCode.NETWORK, 'Network error')

    expect(error.code).toBe(UploadErrorCode.NETWORK)
    expect(error.message).toBe('Network error')
    expect(error.name).toBe('UploadError')
  })
})

describe('Error Factory Functions', () => {
  it('createNetworkError', () => {
    const error = createNetworkError()

    expect(error.code).toBe(UploadErrorCode.NETWORK)
    expect(error.message).toBe('Error de red. Verifica tu conexión.')
  })

  it('createUnauthorizedError', () => {
    const error = createUnauthorizedError()

    expect(error.code).toBe(UploadErrorCode.UNAUTHORIZED)
    expect(error.message).toBe('Sesión expirada. Inicia sesión de nuevo.')
  })

  it('createFileTooLargeError', () => {
    const error = createFileTooLargeError('100 MB')

    expect(error.code).toBe(UploadErrorCode.FILE_TOO_LARGE)
    expect(error.message).toBe('El archivo es demasiado grande. Máximo: 100 MB')
  })

  it('createInvalidFileTypeError', () => {
    const error = createInvalidFileTypeError(['application/pdf', 'image/png'])

    expect(error.code).toBe(UploadErrorCode.INVALID_FILE_TYPE)
    expect(error.message).toBe('Tipo de archivo no permitido. Tipos: application/pdf, image/png')
  })

  it('createServerError', () => {
    const error = createServerError()

    expect(error.code).toBe(UploadErrorCode.SERVER_ERROR)
    expect(error.message).toBe('Error del servidor. Inténtalo de nuevo más tarde.')
  })

  it('createAbortedError', () => {
    const error = createAbortedError()

    expect(error.code).toBe(UploadErrorCode.ABORTED)
    expect(error.message).toBe('Upload cancelado.')
  })

  it('createHttpError for 401', () => {
    const error = createHttpError(401)

    expect(error.code).toBe(UploadErrorCode.UNAUTHORIZED)
  })

  it('createHttpError for 413', () => {
    const error = createHttpError(413)

    expect(error.code).toBe(UploadErrorCode.HTTP_413)
  })

  it('createHttpError for 500', () => {
    const error = createHttpError(500)

    expect(error.code).toBe(UploadErrorCode.SERVER_ERROR)
  })

  it('createHttpError for unknown status', () => {
    const error = createHttpError(429)

    expect(error.code).toBe(UploadErrorCode.HTTP_UNKNOWN)
    expect(error.message).toBe('Error HTTP 429.')
  })
})

describe('Error Handling in UI', () => {
  it('should handle errors by code', () => {
    const error = new UploadError(UploadErrorCode.UNAUTHORIZED, 'Sesión expirada')

    // Example UI logic
    let userMessage = ''
    let shouldShowLogin = false

    switch (error.code) {
      case UploadErrorCode.UNAUTHORIZED:
        userMessage = 'Por favor, inicia sesión de nuevo.'
        shouldShowLogin = true
        break
      case UploadErrorCode.FILE_TOO_LARGE:
        userMessage = 'El archivo es demasiado grande.'
        break
      case UploadErrorCode.NETWORK:
        userMessage = 'Error de red. Verifica tu conexión.'
        break
      default:
        userMessage = 'Ocurrió un error inesperado.'
    }

    expect(shouldShowLogin).toBe(true)
    expect(userMessage).toBe('Por favor, inicia sesión de nuevo.')
  })
})