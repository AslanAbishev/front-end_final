import { apiClient } from './apiClient'
import type { Category } from '@/types/category'

export const categoryService = {
  getAll: () => apiClient<Category[]>('/categories'),

  getBySlug: (slug: string) =>
    apiClient<Category[]>(`/categories?slug=${encodeURIComponent(slug)}`),
}
