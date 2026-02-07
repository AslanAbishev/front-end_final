import React from 'react'

interface BookmarkButtonProps {
  isBookmarked: boolean
  onToggle: () => void
}

export const BookmarkButton = React.memo<BookmarkButtonProps>(
  ({ isBookmarked, onToggle }) => {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggle()
        }}
        aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        className={`p-1 transition-colors ${
          isBookmarked
            ? 'text-yellow-500 hover:text-yellow-600'
            : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <svg
          className="w-6 h-6"
          fill={isBookmarked ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      </button>
    )
  },
)

BookmarkButton.displayName = 'BookmarkButton'
