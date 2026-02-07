export const ARTICLES_PER_PAGE = 10
export const DEBOUNCE_DELAY = 300
export const MIN_USERNAME_LENGTH = 3
export const MIN_PASSWORD_LENGTH = 6
export const SORT_OPTIONS = [
  { value: 'date' as const, label: 'Newest First' },
  { value: 'title' as const, label: 'Title A-Z' },
  { value: 'readTime' as const, label: 'Read Time' },
]
