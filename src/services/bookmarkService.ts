import { apiClient } from './apiClient'
import type { Bookmark } from '@/types/bookmark'

export const bookmarkService = {
  getByUserId: (userId: string) =>
    apiClient<Bookmark[]>(`/bookmarks?userId=${encodeURIComponent(userId)}`),

  create: (data: { userId: string; articleId: string }) =>
    apiClient<Bookmark>('/bookmarks', {
      method: 'POST',
      body: {
        ...data,
        id: `bm-${Date.now()}`,
        createdAt: new Date().toISOString(),
        notes: '',
      },
    }),

  remove: (id: string) =>
    apiClient<void>(`/bookmarks/${id}`, { method: 'DELETE' }),
}
