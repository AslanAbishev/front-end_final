import React from 'react'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export const ErrorMessage = React.memo<ErrorMessageProps>(
  ({ message, onRetry }) => {
    return (
      <div
        className="bg-red-50 border border-red-200 rounded-lg p-4 text-center"
        role="alert"
      >
        <p className="text-red-700 font-medium">Something went wrong</p>
        <p className="text-red-600 text-sm mt-1">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
          >
            Try Again
          </button>
        )}
      </div>
    )
  },
)

ErrorMessage.displayName = 'ErrorMessage'
