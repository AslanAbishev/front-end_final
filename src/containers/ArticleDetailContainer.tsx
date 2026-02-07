import React, { useEffect, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchArticleById,
  clearCurrentArticle,
} from '@/store/slices/articlesSlice'
import { addBookmark, removeBookmark } from '@/store/slices/bookmarksSlice'
import { ArticleDetail } from '@/components/articles/ArticleDetail'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { ErrorMessage } from '@/components/common/ErrorMessage'

export const ArticleDetailContainer: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const article = useAppSelector((state) => state.articles.currentArticle)
  const loading = useAppSelector((state) => state.articles.loading)
  const error = useAppSelector((state) => state.articles.error)
  const bookmarks = useAppSelector((state) => state.bookmarks.items)
  const categories = useAppSelector((state) => state.categories.items)
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  useEffect(() => {
    if (id) {
      dispatch(fetchArticleById(id))
    }
    return () => {
      dispatch(clearCurrentArticle())
    }
  }, [dispatch, id])

  const isBookmarked = useMemo(
    () => bookmarks.some((b) => b.articleId === id),
    [bookmarks, id],
  )

  const category = useMemo(
    () => categories.find((c) => c.id === article?.categoryId),
    [categories, article],
  )

  const handleBookmarkToggle = useCallback(() => {
    if (!isAuthenticated) {
      navigate('/auth/login')
      return
    }
    if (!id) return
    const existing = bookmarks.find((b) => b.articleId === id)
    if (existing) {
      dispatch(removeBookmark(existing.id))
    } else {
      dispatch(addBookmark({ articleId: id }))
    }
  }, [dispatch, bookmarks, id, isAuthenticated, navigate])

  const handleBack = useCallback(() => {
    navigate(-1)
  }, [navigate])

  if (loading) return <LoadingSpinner message="Loading article..." />
  if (error) return <ErrorMessage message={error} />
  if (!article) return <ErrorMessage message="Article not found" />

  return (
    <ArticleDetail
      article={article}
      category={category}
      isBookmarked={isBookmarked}
      onBookmarkToggle={handleBookmarkToggle}
      onBack={handleBack}
    />
  )
}
