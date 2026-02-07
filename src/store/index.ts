import { configureStore } from '@reduxjs/toolkit'
import articlesReducer from './slices/articlesSlice'
import authReducer from './slices/authSlice'
import bookmarksReducer from './slices/bookmarksSlice'
import categoriesReducer from './slices/categoriesSlice'
import userPreferencesReducer from './slices/userPreferencesSlice'

export const store = configureStore({
  reducer: {
    articles: articlesReducer,
    auth: authReducer,
    bookmarks: bookmarksReducer,
    categories: categoriesReducer,
    userPreferences: userPreferencesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
