import { apiClient } from './apiClient'
import type { User } from '@/types/user'

interface UserPreferences {
  id: string
  userId: string
  preferredCategories: string[]
  displayMode: 'grid' | 'list'
  articlesPerPage: number
  theme: 'light' | 'dark'
}

export const userService = {
  checkUsername: (username: string) =>
    apiClient<User[]>(
      `/users?username=${encodeURIComponent(username)}`,
    ),

  checkEmail: (email: string) =>
    apiClient<User[]>(`/users?email=${encodeURIComponent(email)}`),

  getPreferences: (userId: string) =>
    apiClient<UserPreferences[]>(
      `/userPreferences?userId=${encodeURIComponent(userId)}`,
    ),

  updatePreferences: (
    prefId: string,
    data: Partial<Omit<UserPreferences, 'id' | 'userId'>>,
  ) =>
    apiClient<UserPreferences>(`/userPreferences/${prefId}`, {
      method: 'PATCH',
      body: data,
    }),

  createPreferences: (data: Omit<UserPreferences, 'id'>) =>
    apiClient<UserPreferences>('/userPreferences', {
      method: 'POST',
      body: { ...data, id: `pref-${Date.now()}` },
    }),
}
