import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  touched?: boolean
  helpText?: string
}

export const Input = React.memo<InputProps>(
  ({ label, error, touched, helpText, id, className = '', ...props }) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, '-')
    const showError = touched && error

    return (
      <div className="mb-4">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
        <input
          id={inputId}
          className={`w-full px-3 py-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            showError
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300'
          } ${className}`}
          aria-invalid={showError ? 'true' : 'false'}
          aria-describedby={showError ? `${inputId}-error` : undefined}
          {...props}
        />
        {showError && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {helpText && !showError && (
          <p className="mt-1 text-sm text-gray-500">{helpText}</p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
