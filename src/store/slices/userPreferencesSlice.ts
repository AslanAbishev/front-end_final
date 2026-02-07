import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { userService } from '@/services/userService'
import type { RootState } from '@/store'

interface UserPreferencesState {
  id: string | null
  preferredCategories: string[]
  displayMode: 'grid' | 'list'
  articlesPerPage: number
  theme: 'light' | 'dark'
  loading: boolean
  error: string | null
}

const initialState: UserPreferencesState = {
  id: null,
  preferredCategories: [],
  displayMode: 'grid',
  articlesPerPage: 10,
  theme: 'light',
  loading: false,
  error: null,
}

export const fetchPreferences = createAsyncThunk(
  'userPreferences/fetchPreferences',
  async (_: void, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const userId = state.auth.user?.id
      if (!userId) throw new Error('Not authenticated')
      const prefs = await userService.getPreferences(userId)
      if (prefs.length === 0) {
        const newPref = await userService.createPreferences({
          userId,
          preferredCategories: [],
          displayMode: 'grid',
          articlesPerPage: 10,
          theme: 'light',
        })
        return newPref
      }
      return prefs[0]
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  },
)

export const updatePreferences = createAsyncThunk(
  'userPreferences/updatePreferences',
  async (
    data: {
      preferredCategories?: string[]
      displayMode?: 'grid' | 'list'
      articlesPerPage?: number
      theme?: 'light' | 'dark'
    },
    { getState, rejectWithValue },
  ) => {
    try {
      const state = getState() as RootState
      const prefId = state.userPreferences.id
      if (!prefId) throw new Error('Preferences not loaded')
      return await userService.updatePreferences(prefId, data)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  },
)

const userPreferencesSlice = createSlice({
  name: 'userPreferences',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.theme = action.payload
    },
    resetPreferences() {
      return initialState
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPreferences.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPreferences.fulfilled, (state, action) => {
        state.loading = false
        state.id = action.payload.id
        state.preferredCategories = action.payload.preferredCategories
        state.displayMode = action.payload.displayMode
        state.articlesPerPage = action.payload.articlesPerPage
        state.theme = action.payload.theme
      })
      .addCase(fetchPreferences.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(updatePreferences.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.loading = false
        state.preferredCategories = action.payload.preferredCategories
        state.displayMode = action.payload.displayMode
        state.articlesPerPage = action.payload.articlesPerPage
        state.theme = action.payload.theme
      })
      .addCase(updatePreferences.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { setTheme, resetPreferences } = userPreferencesSlice.actions

export const selectPreferences = (state: {
  userPreferences: UserPreferencesState
}) => state.userPreferences
export const selectTheme = (state: {
  userPreferences: UserPreferencesState
}) => state.userPreferences.theme
export const selectDisplayMode = (state: {
  userPreferences: UserPreferencesState
}) => state.userPreferences.displayMode

export default userPreferencesSlice.reducer
