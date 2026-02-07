import React, { useCallback, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { registerUser, clearAuthError } from '@/store/slices/authSlice'
import { useFormValidation } from '@/hooks/useFormValidation'
import { useAsyncValidation } from '@/hooks/useAsyncValidation'
import { userService } from '@/services/userService'
import { RegisterForm } from '@/components/auth/RegisterForm'

interface RegisterFormValues {
  username: string
  email: string
  password: string
  displayName: string
}

export const RegisterContainer: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  const authError = useAppSelector((state) => state.auth.error)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/feed', { replace: true })
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  const form = useFormValidation<RegisterFormValues>(
    { username: '', email: '', password: '', displayName: '' },
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
          message: 'Please enter a valid email address',
        },
      ],
      password: [
        {
          validate: (v) => (v as string).length >= 6,
          message: 'Password must be at least 6 characters',
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

  const checkUsername = useCallback(async (username: string) => {
    const users = await userService.checkUsername(username)
    return users.length === 0
  }, [])

  const checkEmail = useCallback(async (email: string) => {
    const users = await userService.checkEmail(email)
    return users.length === 0
  }, [])

  const { isValidating: isCheckingUsername, isAvailable: isUsernameAvailable } =
    useAsyncValidation(form.values.username as string, checkUsername)

  const { isValidating: isCheckingEmail, isAvailable: isEmailAvailable } =
    useAsyncValidation(form.values.email as string, checkEmail)

  const handleSubmit = useCallback(
    async (values: RegisterFormValues) => {
      await dispatch(registerUser(values)).unwrap()
    },
    [dispatch],
  )

  return (
    <div className="max-w-md mx-auto mt-12">
      <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
        Create Account
      </h1>
      <p className="text-gray-600 text-center mb-8">
        Join ContentHub to bookmark and personalize your feed
      </p>
      <RegisterForm
        values={form.values}
        errors={form.errors}
        touched={form.touched}
        isSubmitting={form.isSubmitting}
        authError={authError}
        isCheckingUsername={isCheckingUsername}
        isUsernameAvailable={isUsernameAvailable}
        isCheckingEmail={isCheckingEmail}
        isEmailAvailable={isEmailAvailable}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        onSubmit={form.handleSubmit(handleSubmit)}
      />
      <p className="text-center mt-6 text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-blue-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
