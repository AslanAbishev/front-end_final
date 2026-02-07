import { describe, it, expect, beforeEach } from 'vitest'
import authReducer, {
  loginUser,
  registerUser,
  logout,
  restoreAuth,
  clearAuthError,
  selectIsAuthenticated,
  selectAuthUser,
  selectAuthLoading,
  selectAuthError,
} from '@/store/slices/authSlice'
import type { AuthState } from '@/types/auth'

const mockUser = {
  id: 'user-001',
  username: 'johndoe',
  email: 'john@example.com',
  displayName: 'John Doe',
  avatarUrl: 'https://i.pravatar.cc/150',
  createdAt: '2025-01-15T08:00:00Z',
}

beforeEach(() => {
  localStorage.clear()
})

describe('authSlice', () => {
  const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  }

  describe('reducers', () => {
    it('should return initial state', () => {
      const state = authReducer(undefined, { type: 'unknown' })
      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })

    it('should handle logout', () => {
      const loggedInState: AuthState = {
        user: mockUser,
        token: 'test-token',
        isAuthenticated: true,
        loading: false,
        error: null,
      }
      localStorage.setItem('auth_token', 'test-token')
      localStorage.setItem('auth_user', JSON.stringify(mockUser))

      const state = authReducer(loggedInState, logout())
      expect(state.user).toBeNull()
      expect(state.token).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(localStorage.getItem('auth_token')).toBeNull()
      expect(localStorage.getItem('auth_user')).toBeNull()
    })

    it('should handle restoreAuth when data exists', () => {
      localStorage.setItem('auth_token', 'test-token')
      localStorage.setItem('auth_user', JSON.stringify(mockUser))

      const state = authReducer(initialState, restoreAuth())
      expect(state.user).toEqual(mockUser)
      expect(state.token).toBe('test-token')
      expect(state.isAuthenticated).toBe(true)
    })

    it('should handle restoreAuth when no data', () => {
      const state = authReducer(initialState, restoreAuth())
      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
    })

    it('should handle clearAuthError', () => {
      const stateWithError: AuthState = {
        ...initialState,
        error: 'Some error',
      }
      const state = authReducer(stateWithError, clearAuthError())
      expect(state.error).toBeNull()
    })
  })

  describe('extraReducers - loginUser', () => {
    it('should set loading on pending', () => {
      const state = authReducer(
        initialState,
        loginUser.pending('', { email: 'test@test.com', password: 'pass' }),
      )
      expect(state.loading).toBe(true)
      expect(state.error).toBeNull()
    })

    it('should set user on fulfilled', () => {
      const payload = { user: mockUser, token: 'test-token' }
      const state = authReducer(
        initialState,
        loginUser.fulfilled(payload, '', {
          email: 'test@test.com',
          password: 'pass',
        }),
      )
      expect(state.loading).toBe(false)
      expect(state.user).toEqual(mockUser)
      expect(state.token).toBe('test-token')
      expect(state.isAuthenticated).toBe(true)
    })

    it('should set error on rejected', () => {
      const state = authReducer(
        initialState,
        loginUser.rejected(
          new Error('fail'),
          '',
          { email: 'test@test.com', password: 'pass' },
          'Invalid credentials',
        ),
      )
      expect(state.loading).toBe(false)
      expect(state.error).toBe('Invalid credentials')
    })
  })

  describe('extraReducers - registerUser', () => {
    it('should set loading on pending', () => {
      const state = authReducer(
        initialState,
        registerUser.pending('', {
          username: 'test',
          email: 'test@test.com',
          password: 'pass',
          displayName: 'Test',
        }),
      )
      expect(state.loading).toBe(true)
    })

    it('should set user on fulfilled', () => {
      const payload = { user: mockUser, token: 'test-token' }
      const state = authReducer(
        initialState,
        registerUser.fulfilled(payload, '', {
          username: 'test',
          email: 'test@test.com',
          password: 'pass',
          displayName: 'Test',
        }),
      )
      expect(state.user).toEqual(mockUser)
      expect(state.isAuthenticated).toBe(true)
    })
  })

  describe('selectors', () => {
    const stateWithAuth = {
      auth: {
        user: mockUser,
        token: 'token',
        isAuthenticated: true,
        loading: true,
        error: 'test error',
      },
    }

    it('selectIsAuthenticated', () => {
      expect(selectIsAuthenticated(stateWithAuth)).toBe(true)
    })

    it('selectAuthUser', () => {
      expect(selectAuthUser(stateWithAuth)).toEqual(mockUser)
    })

    it('selectAuthLoading', () => {
      expect(selectAuthLoading(stateWithAuth)).toBe(true)
    })

    it('selectAuthError', () => {
      expect(selectAuthError(stateWithAuth)).toBe('test error')
    })
  })
})
