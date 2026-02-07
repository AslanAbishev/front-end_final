import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { logout, restoreAuth } from '@/store/slices/authSlice'
import { clearBookmarks } from '@/store/slices/bookmarksSlice'
import { resetPreferences } from '@/store/slices/userPreferencesSlice'

export function useAuth() {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const loading = useAppSelector((state) => state.auth.loading)
  const error = useAppSelector((state) => state.auth.error)

  const handleLogout = useCallback(() => {
    dispatch(logout())
    dispatch(clearBookmarks())
    dispatch(resetPreferences())
  }, [dispatch])

  const handleRestoreAuth = useCallback(() => {
    dispatch(restoreAuth())
  }, [dispatch])

  return {
    user,
    isAuthenticated,
    loading,
    error,
    logout: handleLogout,
    restoreAuth: handleRestoreAuth,
  }
}
