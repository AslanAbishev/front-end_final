import { describe, it, expect } from 'vitest'
import bookmarksReducer, {
  fetchBookmarks,
  addBookmark,
  removeBookmark,
  clearBookmarks,
  selectBookmarks,
  selectBookmarksLoading,
  selectBookmarkArticleIds,
} from '@/store/slices/bookmarksSlice'
import type { Bookmark } from '@/types/bookmark'

const mockBookmark: Bookmark = {
  id: 'bm-001',
  userId: 'user-001',
  articleId: 'art-001',
  createdAt: '2025-12-16T09:00:00Z',
  notes: '',
}

const initialState = {
  items: [],
  loading: false,
  error: null,
}

describe('bookmarksSlice', () => {
  describe('reducers', () => {
    it('should return initial state', () => {
      expect(bookmarksReducer(undefined, { type: 'unknown' })).toEqual(
        initialState,
      )
    })

    it('should handle clearBookmarks', () => {
      const stateWithBookmarks = {
        ...initialState,
        items: [mockBookmark],
      }
      const state = bookmarksReducer(stateWithBookmarks, clearBookmarks())
      expect(state.items).toEqual([])
    })
  })

  describe('extraReducers - fetchBookmarks', () => {
    it('should set loading on pending', () => {
      const state = bookmarksReducer(
        initialState,
        fetchBookmarks.pending('', undefined),
      )
      expect(state.loading).toBe(true)
      expect(state.error).toBeNull()
    })

    it('should set items on fulfilled', () => {
      const bookmarks = [mockBookmark]
      const state = bookmarksReducer(
        initialState,
        fetchBookmarks.fulfilled(bookmarks, '', undefined),
      )
      expect(state.items).toEqual(bookmarks)
      expect(state.loading).toBe(false)
    })

    it('should set error on rejected', () => {
      const state = bookmarksReducer(
        initialState,
        fetchBookmarks.rejected(
          new Error('fail'),
          '',
          undefined,
          'Not authenticated',
        ),
      )
      expect(state.error).toBe('Not authenticated')
      expect(state.loading).toBe(false)
    })
  })

  describe('extraReducers - addBookmark', () => {
    it('should add bookmark on fulfilled', () => {
      const state = bookmarksReducer(
        initialState,
        addBookmark.fulfilled(mockBookmark, '', { articleId: 'art-001' }),
      )
      expect(state.items).toHaveLength(1)
      expect(state.items[0]).toEqual(mockBookmark)
    })

    it('should set error on rejected', () => {
      const state = bookmarksReducer(
        initialState,
        addBookmark.rejected(
          new Error('fail'),
          '',
          { articleId: 'art-001' },
          'Error adding',
        ),
      )
      expect(state.error).toBe('Error adding')
    })
  })

  describe('extraReducers - removeBookmark', () => {
    it('should remove bookmark on fulfilled', () => {
      const stateWithBookmark = {
        ...initialState,
        items: [mockBookmark],
      }
      const state = bookmarksReducer(
        stateWithBookmark,
        removeBookmark.fulfilled('bm-001', '', 'bm-001'),
      )
      expect(state.items).toHaveLength(0)
    })
  })

  describe('selectors', () => {
    const state = {
      bookmarks: {
        items: [
          mockBookmark,
          { ...mockBookmark, id: 'bm-002', articleId: 'art-005' },
        ],
        loading: true,
        error: null,
      },
    }

    it('selectBookmarks returns items', () => {
      expect(selectBookmarks(state)).toHaveLength(2)
    })

    it('selectBookmarksLoading returns loading', () => {
      expect(selectBookmarksLoading(state)).toBe(true)
    })

    it('selectBookmarkArticleIds returns Set of article IDs', () => {
      const ids = selectBookmarkArticleIds(state)
      expect(ids.has('art-001')).toBe(true)
      expect(ids.has('art-005')).toBe(true)
      expect(ids.has('art-999')).toBe(false)
    })
  })
})
