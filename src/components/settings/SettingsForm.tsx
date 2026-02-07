import React from 'react'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import type { Category } from '@/types/category'

interface SettingsFormValues {
  username: string
  email: string
  displayName: string
  preferredCategories: string[]
  displayMode: 'grid' | 'list'
  articlesPerPage: number
  theme: 'light' | 'dark'
}

interface SettingsFormProps {
  values: SettingsFormValues
  errors: Partial<Record<keyof SettingsFormValues, string>>
  touched: Partial<Record<keyof SettingsFormValues, boolean>>
  isSubmitting: boolean
  categories: Category[]
  isCheckingUsername: boolean
  isUsernameAvailable: boolean | null
  onChange: (field: keyof SettingsFormValues, value: unknown) => void
  onBlur: (field: keyof SettingsFormValues) => void
  onSubmit: (e: React.FormEvent) => void
}

export const SettingsForm = React.memo<SettingsFormProps>(
  ({
    values,
    errors,
    touched,
    isSubmitting,
    categories,
    isCheckingUsername,
    isUsernameAvailable,
    onChange,
    onBlur,
    onSubmit,
  }) => {
    const getUsernameHelp = () => {
      if (isCheckingUsername) return 'Checking availability...'
      if (isUsernameAvailable === true) return 'Username is available!'
      if (isUsernameAvailable === false) return 'Username is already taken'
      return undefined
    }

    const handleCategoryToggle = (categoryId: string) => {
      const current = values.preferredCategories
      const updated = current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId]
      onChange('preferredCategories', updated)
    }

    return (
      <form onSubmit={onSubmit} className="space-y-8">
        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Profile Settings
          </h3>
          <div className="space-y-4">
            <Input
              label="Username"
              type="text"
              value={values.username}
              onChange={(e) => onChange('username', e.target.value)}
              onBlur={() => onBlur('username')}
              error={
                errors.username ||
                (isUsernameAvailable === false
                  ? 'Username is already taken'
                  : undefined)
              }
              touched={touched.username}
              helpText={getUsernameHelp()}
            />
            <Input
              label="Display Name"
              type="text"
              value={values.displayName}
              onChange={(e) => onChange('displayName', e.target.value)}
              onBlur={() => onBlur('displayName')}
              error={errors.displayName}
              touched={touched.displayName}
            />
            <Input
              label="Email"
              type="email"
              value={values.email}
              onChange={(e) => onChange('email', e.target.value)}
              onBlur={() => onBlur('email')}
              error={errors.email}
              touched={touched.email}
            />
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Preferred Categories
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((cat) => (
              <label
                key={cat.id}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                  values.preferredCategories.includes(cat.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={values.preferredCategories.includes(cat.id)}
                  onChange={() => handleCategoryToggle(cat.id)}
                  className="sr-only"
                />
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-sm">{cat.name}</span>
              </label>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Display Preferences
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Mode
              </label>
              <div className="flex gap-4">
                {(['grid', 'list'] as const).map((mode) => (
                  <label key={mode} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="displayMode"
                      value={mode}
                      checked={values.displayMode === mode}
                      onChange={() => onChange('displayMode', mode)}
                      className="text-blue-600"
                    />
                    <span className="text-sm capitalize">{mode}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Articles Per Page
              </label>
              <select
                value={values.articlesPerPage}
                onChange={(e) =>
                  onChange('articlesPerPage', Number(e.target.value))
                }
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                {[5, 10, 15, 20, 25].map((n) => (
                  <option key={n} value={n}>
                    {n} articles
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theme
              </label>
              <div className="flex gap-4">
                {(['light', 'dark'] as const).map((t) => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="theme"
                      value={t}
                      checked={values.theme === t}
                      onChange={() => onChange('theme', t)}
                      className="text-blue-600"
                    />
                    <span className="text-sm capitalize">{t}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Button type="submit" isLoading={isSubmitting}>
          Save Settings
        </Button>
      </form>
    )
  },
)

SettingsForm.displayName = 'SettingsForm'
