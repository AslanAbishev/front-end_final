import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Category } from '@/types/category'
import { categoryService } from '@/services/categoryService'

interface CategoriesState {
  items: Category[]
  loading: boolean
  error: string | null
}

const initialState: CategoriesState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_: void, { rejectWithValue }) => {
    try {
      return await categoryService.getAll()
    } catch (err) {
      return rejectWithValue((err as Error).message)
    }
  },
)

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const selectCategories = (state: { categories: CategoriesState }) =>
  state.categories.items
export const selectCategoriesLoading = (state: {
  categories: CategoriesState
}) => state.categories.loading

export default categoriesSlice.reducer
