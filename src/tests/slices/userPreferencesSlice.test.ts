import { describe, it, expect } from 'vitest'
import userPreferencesReducer, {
  fetchPreferences,
  updatePreferences,
  setTheme,
  resetPreferences,
  selectPreferences,
  selectTheme,
  selectDisplayMode,
} from '@/store/slices/userPreferencesSlice'

const initialState = {
  id: null,
  preferredCategories: [],
  displayMode: 'grid' as const,
  articlesPerPage: 10,
  theme: 'light' as const,
  loading: false,
  error: null,
}

const mockPreferences = {
  id: 'pref-001',
  userId: 'user-001',
  preferredCategories: ['cat-tech', 'cat-science'],
  displayMode: 'grid' as const,
  articlesPerPage: 10,
  theme: 'light' as const,
}

describe('userPreferencesSlice', () => {
  describe('reducers', () => {
    it('should return initial state', () => {
      expect(
        userPreferencesReducer(undefined, { type: 'unknown' }),
      ).toEqual(initialState)
    })

    it('should handle setTheme', () => {
      const state = userPreferencesReducer(initialState, setTheme('dark'))
      expect(state.theme).toBe('dark')
    })

    it('should handle resetPreferences', () => {
      const modifiedState = {
        ...initialState,
        id: 'pref-001',
        theme: 'dark' as const,
        preferredCategories: ['cat-tech'],
      }
      const state = userPreferencesReducer(modifiedState, resetPreferences())
      expect(state).toEqual(initialState)
    })
  })

  describe('extraReducers - fetchPreferences', () => {
    it('should set loading on pending', () => {
      const state = userPreferencesReducer(
        initialState,
        fetchPreferences.pending('', undefined),
      )
      expect(state.loading).toBe(true)
    })

    it('should set preferences on fulfilled', () => {
      const state = userPreferencesReducer(
        initialState,
        fetchPreferences.fulfilled(mockPreferences, '', undefined),
      )
      expect(state.loading).toBe(false)
      expect(state.id).toBe('pref-001')
      expect(state.preferredCategories).toEqual(['cat-tech', 'cat-science'])
      expect(state.displayMode).toBe('grid')
    })

    it('should set error on rejected', () => {
      const state = userPreferencesReducer(
        initialState,
        fetchPreferences.rejected(
          new Error('fail'),
          '',
          undefined,
          'Not authenticated',
        ),
      )
      expect(state.error).toBe('Not authenticated')
    })
  })

  describe('extraReducers - updatePreferences', () => {
    it('should set loading on pending', () => {
      const state = userPreferencesReducer(
        initialState,
        updatePreferences.pending('', { theme: 'dark' }),
      )
      expect(state.loading).toBe(true)
    })

    it('should update preferences on fulfilled', () => {
      const updated = { ...mockPreferences, theme: 'dark' as const }
      const state = userPreferencesReducer(
        initialState,
        updatePreferences.fulfilled(updated, '', { theme: 'dark' }),
      )
      expect(state.theme).toBe('dark')
      expect(state.loading).toBe(false)
    })
  })

  describe('selectors', () => {
    const state = {
      userPreferences: {
        ...initialState,
        id: 'pref-001',
        theme: 'dark' as const,
        displayMode: 'list' as const,
      },
    }

    it('selectPreferences returns full preferences', () => {
      const prefs = selectPreferences(state)
      expect(prefs.theme).toBe('dark')
    })

    it('selectTheme returns theme', () => {
      expect(selectTheme(state)).toBe('dark')
    })

    it('selectDisplayMode returns display mode', () => {
      expect(selectDisplayMode(state)).toBe('list')
    })
  })
})
