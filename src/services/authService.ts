import { apiClient } from './apiClient'
import type { User } from '@/types/user'
import type { LoginCredentials, RegisterData } from '@/types/auth'

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const users = await apiClient<User[]>(
      `/users?email=${encodeURIComponent(credentials.email)}&password=${encodeURIComponent(credentials.password)}`,
    )
    if (users.length === 0) {
      throw new Error('Invalid email or password')
    }
    return users[0]
  },

  register: async (data: RegisterData): Promise<User> => {
    return apiClient<User>('/users', {
      method: 'POST',
      body: {
        ...data,
        id: `user-${Date.now()}`,
        avatarUrl: `https://i.pravatar.cc/150?u=${data.username}`,
        createdAt: new Date().toISOString(),
      },
    })
  },
}
