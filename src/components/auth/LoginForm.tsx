import React from 'react'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'

interface LoginFormProps {
  values: { email: string; password: string }
  errors: Partial<Record<'email' | 'password', string>>
  touched: Partial<Record<'email' | 'password', boolean>>
  isSubmitting: boolean
  authError: string | null
  onChange: (field: 'email' | 'password', value: unknown) => void
  onBlur: (field: 'email' | 'password') => void
  onSubmit: (e: React.FormEvent) => void
}

export const LoginForm = React.memo<LoginFormProps>(
  ({ values, errors, touched, isSubmitting, authError, onChange, onBlur, onSubmit }) => {
    return (
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <Input
          label="Email"
          type="email"
          value={values.email}
          onChange={(e) => onChange('email', e.target.value)}
          onBlur={() => onBlur('email')}
          error={errors.email}
          touched={touched.email}
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
          placeholder="Enter your password"
          autoComplete="current-password"
        />
        {authError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3" role="alert">
            <p className="text-red-700 text-sm">{authError}</p>
          </div>
        )}
        <Button type="submit" isLoading={isSubmitting} className="w-full">
          Sign In
        </Button>
      </form>
    )
  },
)

LoginForm.displayName = 'LoginForm'
