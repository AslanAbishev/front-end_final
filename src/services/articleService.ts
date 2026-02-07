import { apiClient } from './apiClient'
import type { Article } from '@/types/article'

export const articleService = {
  getAll: (params?: {
    categoryId?: string
    _page?: number
    _limit?: number
  }) => {
    const searchParams = new URLSearchParams()
    if (params?.categoryId) searchParams.set('categoryId', params.categoryId)
    if (params?._page) searchParams.set('_page', String(params._page))
    if (params?._limit) searchParams.set('_limit', String(params._limit))
    const query = searchParams.toString()
    return apiClient<Article[]>(`/articles${query ? `?${query}` : ''}`)
  },

  getById: (id: string) => apiClient<Article>(`/articles/${id}`),

  search: (q: string) =>
    apiClient<Article[]>(`/articles?q=${encodeURIComponent(q)}`),
}
