import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useArticleFilters } from '@/hooks/useArticleFilters'
import type { Article } from '@/types/article'

const makeArticle = (overrides: Partial<Article> = {}): Article => ({
  id: 'art-001',
  title: 'Test Article',
  summary: 'A test summary about react',
  content: 'Content',
  author: 'Author',
  source: 'Source',
  sourceUrl: 'https://example.com',
  imageUrl: '',
  categoryId: 'cat-tech',
  tags: ['react', 'javascript'],
  publishedAt: '2025-12-15T10:00:00Z',
  readTimeMinutes: 5,
  ...overrides,
})

const articles: Article[] = [
  makeArticle({ id: 'a1', title: 'Alpha React Guide', publishedAt: '2025-12-10T10:00:00Z', readTimeMinutes: 3 }),
  makeArticle({ id: 'a2', title: 'Zeta TypeScript', summary: 'TypeScript tips', tags: ['typescript'], publishedAt: '2025-12-15T10:00:00Z', readTimeMinutes: 10 }),
  makeArticle({ id: 'a3', title: 'Beta Angular', summary: 'Angular patterns', tags: ['angular'], publishedAt: '2025-12-12T10:00:00Z', readTimeMinutes: 7 }),
]

describe('useArticleFilters', () => {
  it('returns all articles when no search query', () => {
    const { result } = renderHook(() =>
      useArticleFilters(articles, '', 'date'),
    )
    expect(result.current).toHaveLength(3)
  })

  it('filters articles by title', () => {
    const { result } = renderHook(() =>
      useArticleFilters(articles, 'react', 'date'),
    )
    expect(result.current).toHaveLength(1)
    expect(result.current[0].id).toBe('a1')
  })

  it('filters articles by summary', () => {
    const { result } = renderHook(() =>
      useArticleFilters(articles, 'TypeScript tips', 'date'),
    )
    expect(result.current).toHaveLength(1)
    expect(result.current[0].id).toBe('a2')
  })

  it('filters articles by tags', () => {
    const { result } = renderHook(() =>
      useArticleFilters(articles, 'angular', 'date'),
    )
    expect(result.current).toHaveLength(1)
    expect(result.current[0].id).toBe('a3')
  })

  it('filters are case-insensitive', () => {
    const { result } = renderHook(() =>
      useArticleFilters(articles, 'REACT', 'date'),
    )
    expect(result.current).toHaveLength(1)
  })

  it('sorts by date (newest first)', () => {
    const { result } = renderHook(() =>
      useArticleFilters(articles, '', 'date'),
    )
    expect(result.current[0].id).toBe('a2')
    expect(result.current[1].id).toBe('a3')
    expect(result.current[2].id).toBe('a1')
  })

  it('sorts by title alphabetically', () => {
    const { result } = renderHook(() =>
      useArticleFilters(articles, '', 'title'),
    )
    expect(result.current[0].id).toBe('a1') // Alpha
    expect(result.current[1].id).toBe('a3') // Beta
    expect(result.current[2].id).toBe('a2') // Zeta
  })

  it('sorts by read time (shortest first)', () => {
    const { result } = renderHook(() =>
      useArticleFilters(articles, '', 'readTime'),
    )
    expect(result.current[0].readTimeMinutes).toBe(3)
    expect(result.current[1].readTimeMinutes).toBe(7)
    expect(result.current[2].readTimeMinutes).toBe(10)
  })

  it('returns empty array when no matches', () => {
    const { result } = renderHook(() =>
      useArticleFilters(articles, 'nonexistent', 'date'),
    )
    expect(result.current).toHaveLength(0)
  })
})
