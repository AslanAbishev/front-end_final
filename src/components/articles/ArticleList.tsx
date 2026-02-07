import React, { useMemo } from 'react'
import type { Article } from '@/types/article'
import { ArticleCard } from './ArticleCard'

interface ArticleListProps {
  articles: Article[]
  bookmarkedIds: Set<string>
  onBookmarkToggle: (articleId: string) => void
  onArticleClick: (articleId: string) => void
  height?: number
}

export const ArticleList = React.memo<ArticleListProps>(
  ({
    articles,
    bookmarkedIds,
    onBookmarkToggle,
    onArticleClick,
  }) => {
    // Defensive: ensure articles is an array
    const safeArticles = Array.isArray(articles) ? articles : []
    const safeBookmarkedIds = bookmarkedIds || new Set<string>()

    const memoizedArticles = useMemo(
      () => safeArticles,
      [safeArticles],
    )

    if (memoizedArticles.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No articles found</p>
          <p className="text-sm mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      )
    }

    return (
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {memoizedArticles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              isBookmarked={safeBookmarkedIds.has(article.id)}
              onBookmarkToggle={onBookmarkToggle}
              onClick={onArticleClick}
            />
          ))}
        </div>
      </div>
    )
  },
)

ArticleList.displayName = 'ArticleList'
