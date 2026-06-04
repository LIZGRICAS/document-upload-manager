/**
 * Upload Error Types
 * 
 * Typed errors for proper error handling in UI
 */

export enum UploadErrorCode {
  NETWORK = 'NETWORK',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  SERVER_ERROR = 'SERVER_ERROR',
  ABORTED = 'ABORTED',
  HTTP_400 = 'HTTP_400',
  HTTP_401 = 'HTTP_401',
  HTTP_413 = 'HTTP_413',
  HTTP_500 = 'HTTP_500',
  HTTP_UNKNOWN = 'HTTP_UNKNOWN',
}

export class UploadError extends Error {
  constructor(
    public readonly code: UploadErrorCode,
    message: string
  ) {
    super(message)
    this.name = 'UploadError'
  }
}

// Factory functions
export const createNetworkError = (): UploadError =>
  new UploadError(UploadErrorCode.NETWORK, 'Error de red. Verifica tu conexión.')

export const createUnauthorizedError = (): UploadError =>
  new UploadError(UploadErrorCode.UNAUTHORIZED, 'Sesión expirada. Inicia sesión de nuevo.')

export const createFileTooLargeError = (maxSize: string): UploadError =>
  new UploadError(UploadErrorCode.FILE_TOO_LARGE, `El archivo es demasiado grande. Máximo: ${maxSize}`)

export const createInvalidFileTypeError = (allowedTypes: string[]): UploadError =>
  new UploadError(UploadErrorCode.INVALID_FILE_TYPE, `Tipo de archivo no permitido. Tipos: ${allowedTypes.join(', ')}`)

export const createServerError = (): UploadError =>
  new UploadError(UploadErrorCode.SERVER_ERROR, 'Error del servidor. Inténtalo de nuevo más tarde.')

export const createAbortedError = (): UploadError =>
  new UploadError(UploadErrorCode.ABORTED, 'Upload cancelado.')

export const createHttpError = (status: number): UploadError => {
  switch (status) {
    case 400:
      return new UploadError(UploadErrorCode.HTTP_400, 'Solicitud inválida.')
    case 401:
      return createUnauthorizedError()
    case 413:
      return new UploadError(UploadErrorCode.HTTP_413, 'El archivo excede el tamaño máximo permitido.')
    case 500:
      return createServerError()
    default:
      return new UploadError(UploadErrorCode.HTTP_UNKNOWN, `Error HTTP ${status}.`)
  }
}