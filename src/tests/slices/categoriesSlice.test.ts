import { describe, it, expect } from 'vitest'
import categoriesReducer, {
  fetchCategories,
  selectCategories,
  selectCategoriesLoading,
} from '@/store/slices/categoriesSlice'
import type { Category } from '@/types/category'

const mockCategory: Category = {
  id: 'cat-tech',
  name: 'Technology',
  slug: 'technology',
  description: 'Latest in tech',
  color: '#3B82F6',
  articleCount: 7,
}

const initialState = {
  items: [],
  loading: false,
  error: null,
}

describe('categoriesSlice', () => {
  describe('initial state', () => {
    it('should return initial state', () => {
      expect(categoriesReducer(undefined, { type: 'unknown' })).toEqual(
        initialState,
      )
    })
  })

  describe('extraReducers - fetchCategories', () => {
    it('should set loading on pending', () => {
      const state = categoriesReducer(
        initialState,
        fetchCategories.pending('', undefined),
      )
      expect(state.loading).toBe(true)
      expect(state.error).toBeNull()
    })

    it('should set items on fulfilled', () => {
      const categories = [mockCategory]
      const state = categoriesReducer(
        initialState,
        fetchCategories.fulfilled(categories, '', undefined),
      )
      expect(state.items).toEqual(categories)
      expect(state.loading).toBe(false)
    })

    it('should set error on rejected', () => {
      const state = categoriesReducer(
        initialState,
        fetchCategories.rejected(
          new Error('fail'),
          '',
          undefined,
          'Network error',
        ),
      )
      expect(state.error).toBe('Network error')
      expect(state.loading).toBe(false)
    })
  })

  describe('selectors', () => {
    const state = {
      categories: {
        items: [mockCategory],
        loading: true,
        error: null,
      },
    }

    it('selectCategories returns items', () => {
      expect(selectCategories(state)).toEqual([mockCategory])
    })

    it('selectCategoriesLoading returns loading state', () => {
      expect(selectCategoriesLoading(state)).toBe(true)
    })
  })
})
