import React from 'react'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'

interface RegisterFormProps {
  values: {
    username: string
    email: string
    password: string
    displayName: string
  }
  errors: Partial<Record<'username' | 'email' | 'password' | 'displayName', string>>
  touched: Partial<Record<'username' | 'email' | 'password' | 'displayName', boolean>>
  isSubmitting: boolean
  authError: string | null
  isCheckingUsername: boolean
  isUsernameAvailable: boolean | null
  isCheckingEmail: boolean
  isEmailAvailable: boolean | null
  onChange: (
    field: 'username' | 'email' | 'password' | 'displayName',
    value: unknown,
  ) => void
  onBlur: (
    field: 'username' | 'email' | 'password' | 'displayName',
  ) => void
  onSubmit: (e: React.FormEvent) => void
}

export const RegisterForm = React.memo<RegisterFormProps>(
  ({
    values,
    errors,
    touched,
    isSubmitting,
    authError,
    isCheckingUsername,
    isUsernameAvailable,
    isCheckingEmail,
    isEmailAvailable,
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

    const getEmailHelp = () => {
      if (isCheckingEmail) return 'Checking availability...'
      if (isEmailAvailable === true) return 'Email is available!'
      if (isEmailAvailable === false) return 'Email is already registered'
      return undefined
    }

    return (
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Input
          label="Username"
          type="text"
          value={values.username}
          onChange={(e) => onChange('username', e.target.value)}
          onBlur={() => onBlur('username')}
          error={
            errors.username ||
            (isUsernameAvailable === false ? 'Username is already taken' : undefined)
          }
          touched={touched.username}
          helpText={getUsernameHelp()}
          placeholder="johndoe"
          autoComplete="username"
        />
        <Input
          label="Display Name"
          type="text"
          value={values.displayName}
          onChange={(e) => onChange('displayName', e.target.value)}
          onBlur={() => onBlur('displayName')}
          error={errors.displayName}
          touched={touched.displayName}
          placeholder="John Doe"
          autoComplete="name"
        />
        <Input
          label="Email"
          type="email"
          value={values.email}
          onChange={(e) => onChange('email', e.target.value)}
          onBlur={() => onBlur('email')}
          error={
            errors.email ||
            (isEmailAvailable === false ? 'Email is already registered' : undefined)
          }
          touched={touched.email}
          helpText={getEmailHelp()}
          placeholder="john@example.com"
          autoComplete="email"
        />
        <Input
          label="Password"
          type="password"
          value={values.password}
          onChange={(e) => onChange('password', e.target.value)}
          onBlur={() => onBlur('password')}
          error={errors.password}
          touched={touched.password}
          placeholder="At least 6 characters"
          autoComplete="new-password"
        />
        {authError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3" role="alert">
            <p className="text-red-700 text-sm">{authError}</p>
          </div>
        )}
        <Button type="submit" isLoading={isSubmitting} className="w-full">
          Create Account
        </Button>
      </form>
    )
  },
)

RegisterForm.displayName = 'RegisterForm'
