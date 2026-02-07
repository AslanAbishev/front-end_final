import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../helpers/renderWithProviders'
import { PrivateRoute } from '@/components/common/PrivateRoute'
import { Routes, Route } from 'react-router-dom'

describe('PrivateRoute', () => {
  it('renders children when authenticated', () => {
    renderWithProviders(
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <div>Protected Content</div>
            </PrivateRoute>
          }
        />
      </Routes>,
      {
        preloadedState: {
          auth: {
            user: {
              id: 'user-001',
              username: 'test',
              email: 'test@test.com',
              displayName: 'Test',
              avatarUrl: '',
              createdAt: '',
            },
            token: 'test-token',
            isAuthenticated: true,
            loading: false,
            error: null,
          },
        },
      },
    )
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })

  it('redirects to login when not authenticated', () => {
    renderWithProviders(
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <div>Protected Content</div>
            </PrivateRoute>
          }
        />
        <Route path="/auth/login" element={<div>Login Page</div>} />
      </Routes>,
      {
        preloadedState: {
          auth: {
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: null,
          },
        },
      },
    )
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })
})
