import React from 'react'
import type { Article } from '@/types/article'
import { formatRelativeTime } from '@/utils/formatDate'
import { BookmarkButton } from '@/components/bookmarks/BookmarkButton'

interface ArticleCardProps {
  article: Article
  isBookmarked: boolean
  onBookmarkToggle: (articleId: string) => void
  onClick: (articleId: string) => void
}

export const ArticleCard = React.memo<ArticleCardProps>(
  ({ article, isBookmarked, onBookmarkToggle, onClick }) => {
    return (
      <div
        className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => onClick(article.id)}
        role="article"
        aria-label={article.title}
      >
        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-48 object-cover"
            loading="lazy"
          />
        )}
        <div className="p-4">
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
              {article.title}
            </h3>
            <BookmarkButton
              isBookmarked={isBookmarked}
              onToggle={() => onBookmarkToggle(article.id)}
            />
          </div>
          <p className="text-gray-600 text-sm mt-2 line-clamp-3">
            {article.summary}
          </p>
          <div className="flex justify-between items-center mt-4 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <span className="font-medium">{article.source}</span>
              <span>&middot;</span>
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{article.readTimeMinutes} min read</span>
              <span>&middot;</span>
              <span>{formatRelativeTime(article.publishedAt)}</span>
            </div>
          </div>
        </div>
      </div>
    )
  },
)

ArticleCard.displayName = 'ArticleCard'
