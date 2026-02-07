import React, { useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchArticles,
  setSearchQuery,
  setSortBy,
} from '@/store/slices/articlesSlice'
import { addBookmark, removeBookmark } from '@/store/slices/bookmarksSlice'
import { useArticleFilters } from '@/hooks/useArticleFilters'
import { ArticleList } from '@/components/articles/ArticleList'
import { ArticleSkeleton } from '@/components/articles/ArticleSkeleton'
import { SearchBar } from '@/components/common/SearchBar'
import { Sidebar } from '@/components/layout/Sidebar'
import { ErrorMessage } from '@/components/common/ErrorMessage'
import { SORT_OPTIONS } from '@/utils/constants'

interface ArticleFeedContainerProps {
  categorySlug?: string
}

export const ArticleFeedContainer: React.FC<ArticleFeedContainerProps> = ({
  categorySlug,
}) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const articles = useAppSelector((state) => state.articles.items) || []
  const loading = useAppSelector((state) => state.articles.loading)
  const error = useAppSelector((state) => state.articles.error)
  const searchQuery = useAppSelector((state) => state.articles.searchQuery)
  const sortBy = useAppSelector((state) => state.articles.sortBy)
  const bookmarks = useAppSelector((state) => state.bookmarks.items) || []
  const categories = useAppSelector((state) => state.categories.items) || []
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  useEffect(() => {
    const category = categories.find((c) => c.slug === categorySlug)
    dispatch(
      fetchArticles(
        category ? { categoryId: category.id } : undefined,
      ),
    )
  }, [dispatch, categorySlug, categories])

  const bookmarkedIds = useMemo(
    () => {
      if (!bookmarks || bookmarks.length === 0) return new Set<string>()
      return new Set(bookmarks.map((b) => b.articleId))
    },
    [bookmarks],
  )

  const filteredArticles = useArticleFilters(articles, searchQuery, sortBy)

  const handleBookmarkToggle = useCallback(
    (articleId: string) => {
      if (!isAuthenticated) {
        navigate('/auth/login')
        return
      }
      const existing = bookmarks.find((b) => b.articleId === articleId)
      if (existing) {
        dispatch(removeBookmark(existing.id))
      } else {
        dispatch(addBookmark({ articleId }))
      }
    },
    [dispatch, bookmarks, isAuthenticated, navigate],
  )

  const handleArticleClick = useCallback(
    (articleId: string) => {
      navigate(`/article/${articleId}`)
    },
    [navigate],
  )

  const handleSearch = useCallback(
    (query: string) => {
      dispatch(setSearchQuery(query))
    },
    [dispatch],
  )

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(setSortBy(e.target.value as 'date' | 'title' | 'readTime'))
    },
    [dispatch],
  )

  const handleCategorySelect = useCallback(
    (slug: string | null) => {
      navigate(slug ? `/feed/${slug}` : '/feed')
    },
    [navigate],
  )

  const handleRetry = useCallback(() => {
    dispatch(fetchArticles())
  }, [dispatch])

  return (
    <div className="flex gap-8">
      <Sidebar
        categories={categories}
        activeCategory={categorySlug || null}
        onCategorySelect={handleCategorySelect}
      />
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar value={searchQuery} onSearch={handleSearch} />
          </div>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="border border-gray-300 rounded-lg px-3 py-3 text-sm bg-white"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <ArticleSkeleton key={i} />
            ))}
          </div>
        )}

        {error && <ErrorMessage message={error} onRetry={handleRetry} />}

        {!loading && !error && (
          <ArticleList
            articles={filteredArticles}
            bookmarkedIds={bookmarkedIds}
            onBookmarkToggle={handleBookmarkToggle}
            onArticleClick={handleArticleClick}
          />
        )}
      </div>
    </div>
  )
}
