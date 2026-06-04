/**
 * Concurrency Utilities
 * 
 * limitConcurrency - Execute tasks with controlled concurrency
 * Preserves order and handles errors
 */

export type Task<T> = () => Promise<T>

// Firma exacta según PDF (Promise<T[]>)
// Este es el que se debe usar para la implementación final
export const limitConcurrency = <T>(
  tasks: Task<T>[],
  limit: number
): Promise<T[]> => {
  const results: T[] = new Array(tasks.length)
  let nextIndex = 0
  let activeCount = 0

  return new Promise((resolve, reject) => {
    const processNext = () => {
      if (nextIndex >= tasks.length && activeCount === 0) {
        resolve(results)
        return
      }

      while (activeCount < limit && nextIndex < tasks.length) {
        const currentIndex = nextIndex++
        const task = tasks[currentIndex]

        if (!task) {
          activeCount--
          processNext()
          return
        }

        activeCount++

        task()
          .then((result) => {
            results[currentIndex] = result
            activeCount--
            processNext()
          })
          .catch((error) => {
            results[currentIndex] = error as T
            activeCount--
            processNext()
          })
      }
    }

    processNext()
  })
}

// Versión para manejar errores parciales (PromiseSettledResult[])
// Útil cuando se desea procesar los errores individualmente
export const limitConcurrencySettled = <T>(
  tasks: Task<T>[],
  limit: number
): Promise<PromiseSettledResult<T>[]> => {
  const results: PromiseSettledResult<T>[] = new Array(tasks.length)
  let nextIndex = 0
  let activeCount = 0
  let completedCount = 0

  return new Promise((resolve) => {
    const processNext = () => {
      if (completedCount === tasks.length) {
        resolve(results)
        return
      }

      while (activeCount < limit && nextIndex < tasks.length) {
        const currentIndex = nextIndex++
        const task = tasks[currentIndex]

        if (!task) {
          activeCount--
          completedCount++
          processNext()
          return
        }

        activeCount++

        task()
          .then((result) => {
            results[currentIndex] = { status: 'fulfilled', value: result }
            completedCount++
            activeCount--
            processNext()
          })
          .catch((error) => {
            results[currentIndex] = { status: 'rejected', reason: error }
            completedCount++
            activeCount--
            processNext()
          })
      }
    }

    processNext()
  })
}

/**
 * Ejemplo de uso:
 * 
 * const tasks = [
 *   () => fetch('/api/upload1'),
 *   () => fetch('/api/upload2'),
 *   () => fetch('/api/upload3'),
 * ]
 * 
 * // Con límite de 2 concurrentes
 * const results = await limitConcurrency(tasks, 2)
 * 
 * // O con manejo de errores
 * const results = await limitConcurrencySettled(tasks, 2)
 * results.forEach((result, index) => {
 *   if (result.status === 'fulfilled') {
 *     console.log(`Task ${index} succeeded:`, result.value)
 *   } else {
 *     console.error(`Task ${index} failed:`, result.reason)
 *   }
 * })
 */