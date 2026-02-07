import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ArticleCard } from '@/components/articles/ArticleCard'
import type { Article } from '@/types/article'

const mockArticle: Article = {
  id: 'art-001',
  title: 'Test Article Title',
  summary: 'This is a test summary for the article.',
  content: 'Full content',
  author: 'Test Author',
  source: 'Test Source',
  sourceUrl: 'https://example.com',
  imageUrl: 'https://picsum.photos/800/400',
  categoryId: 'cat-tech',
  tags: ['test'],
  publishedAt: '2025-12-15T10:30:00Z',
  readTimeMinutes: 5,
}

describe('ArticleCard', () => {
  it('renders article title and summary', () => {
    render(
      <ArticleCard
        article={mockArticle}
        isBookmarked={false}
        onBookmarkToggle={vi.fn()}
        onClick={vi.fn()}
      />,
    )
    expect(screen.getByText('Test Article Title')).toBeInTheDocument()
    expect(
      screen.getByText('This is a test summary for the article.'),
    ).toBeInTheDocument()
  })

  it('renders source and author', () => {
    render(
      <ArticleCard
        article={mockArticle}
        isBookmarked={false}
        onBookmarkToggle={vi.fn()}
        onClick={vi.fn()}
      />,
    )
    expect(screen.getByText('Test Source')).toBeInTheDocument()
    expect(screen.getByText('Test Author')).toBeInTheDocument()
  })

  it('renders read time', () => {
    render(
      <ArticleCard
        article={mockArticle}
        isBookmarked={false}
        onBookmarkToggle={vi.fn()}
        onClick={vi.fn()}
      />,
    )
    expect(screen.getByText('5 min read')).toBeInTheDocument()
  })

  it('shows remove bookmark label when bookmarked', () => {
    render(
      <ArticleCard
        article={mockArticle}
        isBookmarked={true}
        onBookmarkToggle={vi.fn()}
        onClick={vi.fn()}
      />,
    )
    expect(screen.getByLabelText('Remove bookmark')).toBeInTheDocument()
  })

  it('shows add bookmark label when not bookmarked', () => {
    render(
      <ArticleCard
        article={mockArticle}
        isBookmarked={false}
        onBookmarkToggle={vi.fn()}
        onClick={vi.fn()}
      />,
    )
    expect(screen.getByLabelText('Add bookmark')).toBeInTheDocument()
  })

  it('calls onBookmarkToggle when bookmark button clicked', () => {
    const onToggle = vi.fn()
    render(
      <ArticleCard
        article={mockArticle}
        isBookmarked={false}
        onBookmarkToggle={onToggle}
        onClick={vi.fn()}
      />,
    )
    fireEvent.click(screen.getByLabelText('Add bookmark'))
    expect(onToggle).toHaveBeenCalledWith('art-001')
  })

  it('calls onClick when card is clicked', () => {
    const onClick = vi.fn()
    render(
      <ArticleCard
        article={mockArticle}
        isBookmarked={false}
        onBookmarkToggle={vi.fn()}
        onClick={onClick}
      />,
    )
    fireEvent.click(screen.getByRole('article'))
    expect(onClick).toHaveBeenCalledWith('art-001')
  })

  it('does not trigger onClick when bookmark button is clicked', () => {
    const onClick = vi.fn()
    const onToggle = vi.fn()
    render(
      <ArticleCard
        article={mockArticle}
        isBookmarked={false}
        onBookmarkToggle={onToggle}
        onClick={onClick}
      />,
    )
    fireEvent.click(screen.getByLabelText('Add bookmark'))
    expect(onToggle).toHaveBeenCalled()
    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders image when imageUrl is provided', () => {
    render(
      <ArticleCard
        article={mockArticle}
        isBookmarked={false}
        onBookmarkToggle={vi.fn()}
        onClick={vi.fn()}
      />,
    )
    const img = screen.getByAltText('Test Article Title')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', mockArticle.imageUrl)
  })
})
