import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Article } from '@/types/article'
import { articleService } from '@/services/articleService'

interface ArticlesState {
  items: Article[]
  currentArticle: Article | null
  loading: boolean
  error: string | null
  searchQuery: string
  sortBy: 'date' | 'title' | 'readTime'
}

const initialState: ArticlesState = {
  items: [],
  currentArticle: null,
  loading: false,
  error: null,
  searchQuery: '',
  sortBy: 'date',
}

export const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async (
    params: { categoryId?: string; page?: number } | undefined,
    { rejectWithValue },
  ) => {
    try {
      return await articleService.getAll(
        params
          ? { categoryId: params.categoryId, _page: params.page }
          : undefined,
      )
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  },
)

export const fetchArticleById = createAsyncThunk(
  'articles/fetchArticleById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await articleService.getById(id)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  },
)

export const searchArticles = createAsyncThunk(
  'articles/searchArticles',
  async (query: string, { rejectWithValue }) => {
    try {
      return await articleService.search(query)
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  },
)

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload
    },
    setSortBy(state, action: PayloadAction<'date' | 'title' | 'readTime'>) {
      state.sortBy = action.payload
    },
    clearCurrentArticle(state) {
      state.currentArticle = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchArticleById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchArticleById.fulfilled, (state, action) => {
        state.loading = false
        state.currentArticle = action.payload
      })
      .addCase(fetchArticleById.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(searchArticles.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(searchArticles.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(searchArticles.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { setSearchQuery, setSortBy, clearCurrentArticle } =
  articlesSlice.actions

export const selectAllArticles = (state: { articles: ArticlesState }) =>
  state.articles.items
export const selectCurrentArticle = (state: { articles: ArticlesState }) =>
  state.articles.currentArticle
export const selectArticlesLoading = (state: { articles: ArticlesState }) =>
  state.articles.loading
export const selectArticlesError = (state: { articles: ArticlesState }) =>
  state.articles.error
export const selectSearchQuery = (state: { articles: ArticlesState }) =>
  state.articles.searchQuery
export const selectSortBy = (state: { articles: ArticlesState }) =>
  state.articles.sortBy

export default articlesSlice.reducer
