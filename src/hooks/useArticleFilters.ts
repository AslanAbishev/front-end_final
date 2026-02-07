import { useMemo } from 'react'
import type { Article } from '@/types/article'

export function useArticleFilters(
  articles: Article[],
  searchQuery: string,
  sortBy: 'date' | 'title' | 'readTime',
) {
  const filtered = useMemo(() => {
    if (!articles) return []
    if (!searchQuery) return articles
    const q = searchQuery.toLowerCase()
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q)),
    )
  }, [articles, searchQuery])

  const sorted = useMemo(() => {
    if (!filtered || filtered.length === 0) return filtered || []
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return (
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
          )
        case 'title':
          return a.title.localeCompare(b.title)
        case 'readTime':
          return a.readTimeMinutes - b.readTimeMinutes
        default:
          return 0
      }
    })
  }, [filtered, sortBy])

  return sorted
}
