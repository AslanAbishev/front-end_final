import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from '@/store'
import { Layout } from '@/components/layout/Layout'
import { PrivateRoute } from '@/components/common/PrivateRoute'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

const FeedPage = lazy(() => import('@/pages/FeedPage'))
const CategoryFeedPage = lazy(() => import('@/pages/CategoryFeedPage'))
const ArticlePage = lazy(() => import('@/pages/ArticlePage'))
const BookmarksPage = lazy(() => import('@/pages/BookmarksPage'))
const SettingsPage = lazy(() => import('@/pages/SettingsPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/RegisterPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner size="lg" message="Loading..." />}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/feed" replace />} />
              <Route path="feed" element={<FeedPage />} />
              <Route path="feed/:category" element={<CategoryFeedPage />} />
              <Route path="article/:id" element={<ArticlePage />} />

              <Route path="auth/login" element={<LoginPage />} />
              <Route path="auth/register" element={<RegisterPage />} />

              <Route
                path="bookmarks"
                element={
                  <PrivateRoute>
                    <BookmarksPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="settings"
                element={
                  <PrivateRoute>
                    <SettingsPage />
                  </PrivateRoute>
                }
              />

              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Provider>
  )
}

export default App
