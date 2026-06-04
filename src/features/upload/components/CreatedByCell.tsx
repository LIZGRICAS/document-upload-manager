/**
 * CreatedByCell Component
 * 
 * Displays user identity (system or current user)
 */

import React from 'react'

interface CreatedByCellProps {}

export const CreatedByCell: React.FC<CreatedByCellProps> = () => {
  // For demo, use "Current User" or "System"
  const userName = typeof window !== 'undefined' ? 'Current User' : 'System'

  return (
    <div className="text-sm text-gray-600 dark:text-gray-400" role="cell">
      {userName}
    </div>
  )
}