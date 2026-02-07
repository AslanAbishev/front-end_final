import React, { useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { fetchArticles } from '@/store/slices/articlesSlice'
import { removeBookmark } from '@/store/slices/bookmarksSlice'
import { BookmarkList } from '@/components/bookmarks/BookmarkList'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { ErrorMessage } from '@/components/common/ErrorMessage'

export const BookmarksContainer: React.FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const bookmarks = useAppSelector((state) => state.bookmarks.items)
  const articles = useAppSelector((state) => state.articles.items)
  const loading = useAppSelector((state) => state.bookmarks.loading)
  const error = useAppSelector((state) => state.bookmarks.error)

  useEffect(() => {
    if (articles.length === 0) {
      dispatch(fetchArticles())
    }
  }, [dispatch, articles.length])

  const handleBookmarkToggle = useCallback(
    (articleId: string) => {
      const bookmark = bookmarks.find((b) => b.articleId === articleId)
      if (bookmark) {
        dispatch(removeBookmark(bookmark.id))
      }
    },
    [dispatch, bookmarks],
  )

  const handleArticleClick = useCallback(
    (articleId: string) => {
      navigate(`/article/${articleId}`)
    },
    [navigate],
  )

  if (loading) return <LoadingSpinner message="Loading bookmarks..." />
  if (error) return <ErrorMessage message={error} />

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookmarks</h1>
      <BookmarkList
        bookmarks={bookmarks}
        articles={articles}
        onBookmarkToggle={handleBookmarkToggle}
        onArticleClick={handleArticleClick}
      />
    </div>
  )
}
