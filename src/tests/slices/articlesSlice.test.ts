import { describe, it, expect } from 'vitest'
import articlesReducer, {
  fetchArticles,
  fetchArticleById,
  searchArticles,
  setSearchQuery,
  setSortBy,
  clearCurrentArticle,
  selectAllArticles,
  selectCurrentArticle,
  selectArticlesLoading,
  selectArticlesError,
  selectSearchQuery,
  selectSortBy,
} from '@/store/slices/articlesSlice'
import type { Article } from '@/types/article'

const mockArticle: Article = {
  id: 'art-001',
  title: 'Test Article',
  summary: 'Test summary',
  content: 'Test content',
  author: 'Author',
  source: 'Source',
  sourceUrl: 'https://example.com',
  imageUrl: 'https://picsum.photos/800/400',
  categoryId: 'cat-tech',
  tags: ['test'],
  publishedAt: '2025-12-15T10:30:00Z',
  readTimeMinutes: 5,
}

const initialState = {
  items: [],
  currentArticle: null,
  loading: false,
  error: null,
  searchQuery: '',
  sortBy: 'date' as const,
}

describe('articlesSlice', () => {
  describe('reducers', () => {
    it('should return initial state', () => {
      expect(articlesReducer(undefined, { type: 'unknown' })).toEqual(
        initialState,
      )
    })

    it('should handle setSearchQuery', () => {
      const state = articlesReducer(initialState, setSearchQuery('react'))
      expect(state.searchQuery).toBe('react')
    })

    it('should handle setSortBy', () => {
      const state = articlesReducer(initialState, setSortBy('title'))
      expect(state.sortBy).toBe('title')
    })

    it('should handle setSortBy to readTime', () => {
      const state = articlesReducer(initialState, setSortBy('readTime'))
      expect(state.sortBy).toBe('readTime')
    })

    it('should handle clearCurrentArticle', () => {
      const stateWithArticle = {
        ...initialState,
        currentArticle: mockArticle,
      }
      const state = articlesReducer(stateWithArticle, clearCurrentArticle())
      expect(state.currentArticle).toBeNull()
    })
  })

  describe('extraReducers - fetchArticles', () => {
    it('should set loading on pending', () => {
      const state = articlesReducer(
        initialState,
        fetchArticles.pending('', undefined),
      )
      expect(state.loading).toBe(true)
      expect(state.error).toBeNull()
    })

    it('should set items on fulfilled', () => {
      const articles = [mockArticle]
      const state = articlesReducer(
        initialState,
        fetchArticles.fulfilled(articles, '', undefined),
      )
      expect(state.loading).toBe(false)
      expect(state.items).toEqual(articles)
    })

    it('should set error on rejected', () => {
      const state = articlesReducer(
        initialState,
        fetchArticles.rejected(
          new Error('fail'),
          '',
          undefined,
          'Network error',
        ),
      )
      expect(state.loading).toBe(false)
      expect(state.error).toBe('Network error')
    })
  })

  describe('extraReducers - fetchArticleById', () => {
    it('should set loading on pending', () => {
      const state = articlesReducer(
        initialState,
        fetchArticleById.pending('', 'art-001'),
      )
      expect(state.loading).toBe(true)
    })

    it('should set currentArticle on fulfilled', () => {
      const state = articlesReducer(
        initialState,
        fetchArticleById.fulfilled(mockArticle, '', 'art-001'),
      )
      expect(state.currentArticle).toEqual(mockArticle)
      expect(state.loading).toBe(false)
    })

    it('should set error on rejected', () => {
      const state = articlesReducer(
        initialState,
        fetchArticleById.rejected(
          new Error('fail'),
          '',
          'art-001',
          'Not found',
        ),
      )
      expect(state.error).toBe('Not found')
    })
  })

  describe('extraReducers - searchArticles', () => {
    it('should set loading on pending', () => {
      const state = articlesReducer(
        initialState,
        searchArticles.pending('', 'react'),
      )
      expect(state.loading).toBe(true)
    })

    it('should set items on fulfilled', () => {
      const articles = [mockArticle]
      const state = articlesReducer(
        initialState,
        searchArticles.fulfilled(articles, '', 'react'),
      )
      expect(state.items).toEqual(articles)
      expect(state.loading).toBe(false)
    })
  })

  describe('selectors', () => {
    const stateWithData = {
      articles: {
        ...initialState,
        items: [mockArticle],
        currentArticle: mockArticle,
        loading: true,
        error: 'test error',
        searchQuery: 'react',
        sortBy: 'title' as const,
      },
    }

    it('selectAllArticles returns items', () => {
      expect(selectAllArticles(stateWithData)).toEqual([mockArticle])
    })

    it('selectCurrentArticle returns current article', () => {
      expect(selectCurrentArticle(stateWithData)).toEqual(mockArticle)
    })

    it('selectArticlesLoading returns loading state', () => {
      expect(selectArticlesLoading(stateWithData)).toBe(true)
    })

    it('selectArticlesError returns error', () => {
      expect(selectArticlesError(stateWithData)).toBe('test error')
    })

    it('selectSearchQuery returns search query', () => {
      expect(selectSearchQuery(stateWithData)).toBe('react')
    })

    it('selectSortBy returns sort by', () => {
      expect(selectSortBy(stateWithData)).toBe('title')
    })
  })
})
