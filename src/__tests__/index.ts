/**
 * Test Entry Point
 * 
 * Import all test files here
 */

// Types and domain
import './upload.types.test'
import './domain.test'

// Utilities
import './concurrency.test'

// Config
import './config.test'

// Aggregate test results
declare const __TEST_RESULTS__: {
  total: number
  passed: number
  failed: number
}

// Log results
if (typeof __TEST_RESULTS__ !== 'undefined') {
  console.log('\n========================================')
  console.log('Test Results:')
  console.log(`  Total:  ${__TEST_RESULTS__.total}`)
  console.log(`  Passed: ${__TEST_RESULTS__.passed}`)
  console.log(`  Failed: ${__TEST_RESULTS__.failed}`)
  console.log('========================================\n')
}