import React, { type PropsWithChildren } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import articlesReducer from '@/store/slices/articlesSlice'
import authReducer from '@/store/slices/authSlice'
import bookmarksReducer from '@/store/slices/bookmarksSlice'
import categoriesReducer from '@/store/slices/categoriesSlice'
import userPreferencesReducer from '@/store/slices/userPreferencesSlice'
import type { RootState } from '@/store'

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>
  route?: string
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    route = '/',
    ...renderOptions
  }: ExtendedRenderOptions = {},
) {
  const store = configureStore({
    reducer: {
      articles: articlesReducer,
      auth: authReducer,
      bookmarks: bookmarksReducer,
      categories: categoriesReducer,
      userPreferences: userPreferencesReducer,
    },
    preloadedState: preloadedState as RootState,
  })

  function Wrapper({ children }: PropsWithChildren) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </Provider>
    )
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}
