export interface Article {
  id: string
  title: string
  summary: string
  content: string
  author: string
  source: string
  sourceUrl: string
  imageUrl: string
  categoryId: string
  tags: string[]
  publishedAt: string
  readTimeMinutes: number
}
