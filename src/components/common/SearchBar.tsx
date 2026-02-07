import React, { useState, useCallback, useEffect } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { DEBOUNCE_DELAY } from '@/utils/constants'

interface SearchBarProps {
  value: string
  onSearch: (query: string) => void
  placeholder?: string
}

export const SearchBar = React.memo<SearchBarProps>(
  ({ value, onSearch, placeholder = 'Search articles...' }) => {
    const [localValue, setLocalValue] = useState(value)
    const debouncedValue = useDebounce(localValue, DEBOUNCE_DELAY)

    useEffect(() => {
      onSearch(debouncedValue)
    }, [debouncedValue, onSearch])

    useEffect(() => {
      setLocalValue(value)
    }, [value])

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalValue(e.target.value)
      },
      [],
    )

    const handleClear = useCallback(() => {
      setLocalValue('')
    }, [])

    return (
      <div className="relative mb-6">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Search articles"
        />
        {localValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    )
  },
)

SearchBar.displayName = 'SearchBar'
