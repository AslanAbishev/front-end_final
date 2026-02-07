import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { useAuth } from '@/hooks/useAuth'
import { useAppDispatch } from '@/store/hooks'
import { fetchCategories } from '@/store/slices/categoriesSlice'
import { fetchBookmarks } from '@/store/slices/bookmarksSlice'
import { fetchPreferences } from '@/store/slices/userPreferencesSlice'

export const Layout: React.FC = () => {
  const dispatch = useAppDispatch()
  const { isAuthenticated, user, logout, restoreAuth } = useAuth()

  useEffect(() => {
    restoreAuth()
    dispatch(fetchCategories())
  }, [dispatch, restoreAuth])

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchBookmarks())
      dispatch(fetchPreferences())
    }
  }, [dispatch, isAuthenticated])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header
        isAuthenticated={isAuthenticated}
        userName={user?.displayName}
        onLogout={logout}
      />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
