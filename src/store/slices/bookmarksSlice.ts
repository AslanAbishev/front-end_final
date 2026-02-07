import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Bookmark } from '@/types/bookmark'
import { bookmarkService } from '@/services/bookmarkService'
import type { RootState } from '@/store'

interface BookmarksState {
  items: Bookmark[]
  loading: boolean
  error: string | null
}

const initialState: BookmarksState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchBookmarks = createAsyncThunk(
  'bookmarks/fetchBookmarks',
  async (_: void, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const userId = state.auth.user?.id
      if (!userId) throw new Error('Not authenticated')
      return await bookmarkService.getByUserId(userId)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  },
)

export const addBookmark = createAsyncThunk(
  'bookmarks/addBookmark',
  async (
    { articleId }: { articleId: string },
    { getState, rejectWithValue },
  ) => {
    try {
      const state = getState() as RootState
      const userId = state.auth.user?.id
      if (!userId) throw new Error('Not authenticated')
      return await bookmarkService.create({ userId, articleId })
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  },
)

export const removeBookmark = createAsyncThunk(
  'bookmarks/removeBookmark',
  async (bookmarkId: string, { rejectWithValue }) => {
    try {
      await bookmarkService.remove(bookmarkId)
      return bookmarkId
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  },
)

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    clearBookmarks(state) {
      state.items = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookmarks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchBookmarks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(addBookmark.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(addBookmark.rejected, (state, action) => {
        state.error = action.payload as string
      })
      .addCase(removeBookmark.fulfilled, (state, action) => {
        state.items = state.items.filter((b) => b.id !== action.payload)
      })
      .addCase(removeBookmark.rejected, (state, action) => {
        state.error = action.payload as string
      })
  },
})

export const { clearBookmarks } = bookmarksSlice.actions

export const selectBookmarks = (state: { bookmarks: BookmarksState }) =>
  state.bookmarks.items
export const selectBookmarksLoading = (state: { bookmarks: BookmarksState }) =>
  state.bookmarks.loading
export const selectBookmarkArticleIds = (state: {
  bookmarks: BookmarksState
}) => new Set(state.bookmarks.items.map((b) => b.articleId))

export default bookmarksSlice.reducer
