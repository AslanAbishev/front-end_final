import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  message?: string
}

export const LoadingSpinner = React.memo<LoadingSpinnerProps>(
  ({ size = 'md', message }) => {
    const sizeClasses = {
      sm: 'w-5 h-5',
      md: 'w-8 h-8',
      lg: 'w-12 h-12',
    }

    return (
      <div className="flex flex-col items-center justify-center py-8" role="status">
        <div
          className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}
        />
        {message && (
          <p className="mt-3 text-gray-600 text-sm">{message}</p>
        )}
        <span className="sr-only">Loading...</span>
      </div>
    )
  },
)

LoadingSpinner.displayName = 'LoadingSpinner'
