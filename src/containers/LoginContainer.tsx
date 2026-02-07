import React, { useCallback, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { loginUser, clearAuthError } from '@/store/slices/authSlice'
import { useFormValidation } from '@/hooks/useFormValidation'
import { LoginForm } from '@/components/auth/LoginForm'

interface LoginFormValues {
  email: string
  password: string
}

export const LoginContainer: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const authError = useAppSelector((state) => state.auth.error)

  const from = (location.state as { from?: { pathname: string } })?.from
    ?.pathname || '/feed'

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  const form = useFormValidation<LoginFormValues>(
    { email: '', password: '' },
    {
      email: [
        {
          validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v as string),
          message: 'Please enter a valid email address',
        },
      ],
      password: [
        {
          validate: (v) => (v as string).length >= 6,
          message: 'Password must be at least 6 characters',
        },
      ],
    },
  )

  const handleSubmit = useCallback(
    async (values: LoginFormValues) => {
      await dispatch(loginUser(values)).unwrap()
    },
    [dispatch],
  )

  return (
    <div className="max-w-md mx-auto mt-12">
      <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
        Welcome Back
      </h1>
      <p className="text-gray-600 text-center mb-8">
        Sign in to access your bookmarks and preferences
      </p>
      <LoginForm
        values={form.values}
        errors={form.errors}
        touched={form.touched}
        isSubmitting={form.isSubmitting}
        authError={authError}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        onSubmit={form.handleSubmit(handleSubmit)}
      />
      <p className="text-center mt-6 text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link to="/auth/register" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}
