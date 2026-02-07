import React, { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useFormValidation } from '@/hooks/useFormValidation'
import { useAsyncValidation } from '@/hooks/useAsyncValidation'
import { userService } from '@/services/userService'
import { updatePreferences } from '@/store/slices/userPreferencesSlice'
import { SettingsForm } from '@/components/settings/SettingsForm'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'

interface SettingsFormValues {
  username: string
  email: string
  displayName: string
  preferredCategories: string[]
  displayMode: 'grid' | 'list'
  articlesPerPage: number
  theme: 'light' | 'dark'
}

export const SettingsContainer: React.FC = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const preferences = useAppSelector((state) => state.userPreferences)
  const categories = useAppSelector((state) => state.categories.items)

  const form = useFormValidation<SettingsFormValues>(
    {
      username: user?.username || '',
      email: user?.email || '',
      displayName: user?.displayName || '',
      preferredCategories: preferences.preferredCategories,
      displayMode: preferences.displayMode,
      articlesPerPage: preferences.articlesPerPage,
      theme: preferences.theme,
    },
    {
      username: [
        {
          validate: (v) => (v as string).length >= 3,
          message: 'Username must be at least 3 characters',
        },
        {
          validate: (v) => /^[a-zA-Z0-9_]+$/.test(v as string),
          message: 'Only letters, numbers, and underscores',
        },
      ],
      email: [
        {
          validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v as string),
          message: 'Invalid email address',
        },
      ],
      displayName: [
        {
          validate: (v) => (v as string).length >= 2,
          message: 'Display name must be at least 2 characters',
        },
      ],
    },
  )

  const checkUsername = useCallback(
    async (username: string) => {
      if (username === user?.username) return true
      const users = await userService.checkUsername(username)
      return users.length === 0
    },
    [user?.username],
  )

  const { isValidating: isCheckingUsername, isAvailable: isUsernameAvailable } =
    useAsyncValidation(form.values.username as string, checkUsername)

  const handleSubmit = useCallback(
    async (values: SettingsFormValues) => {
      await dispatch(
        updatePreferences({
          preferredCategories: values.preferredCategories,
          displayMode: values.displayMode,
          articlesPerPage: values.articlesPerPage,
          theme: values.theme,
        }),
      ).unwrap()
    },
    [dispatch],
  )

  if (preferences.loading && !preferences.id) {
    return <LoadingSpinner message="Loading settings..." />
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>
      <SettingsForm
        values={form.values}
        errors={form.errors}
        touched={form.touched}
        isSubmitting={form.isSubmitting}
        categories={categories}
        isCheckingUsername={isCheckingUsername}
        isUsernameAvailable={isUsernameAvailable}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        onSubmit={form.handleSubmit(handleSubmit)}
      />
    </div>
  )
}
