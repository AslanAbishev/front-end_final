import React from 'react'
import type { Article } from '@/types/article'
import { formatDate } from '@/utils/formatDate'
import { BookmarkButton } from '@/components/bookmarks/BookmarkButton'
import { CategoryBadge } from '@/components/categories/CategoryBadge'
import type { Category } from '@/types/category'

interface ArticleDetailProps {
  article: Article
  category?: Category
  isBookmarked: boolean
  onBookmarkToggle: () => void
  onBack: () => void
}

export const ArticleDetail = React.memo<ArticleDetailProps>(
  ({ article, category, isBookmarked, onBookmarkToggle, onBack }) => {
    return (
      <article className="max-w-3xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to feed
        </button>

        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg mb-6"
          />
        )}

        <div className="flex items-center gap-3 mb-4">
          {category && (
            <CategoryBadge name={category.name} color={category.color} />
          )}
          <span className="text-sm text-gray-500">
            {article.readTimeMinutes} min read
          </span>
        </div>

        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-900 flex-1">
            {article.title}
          </h1>
          <BookmarkButton
            isBookmarked={isBookmarked}
            onToggle={onBookmarkToggle}
          />
        </div>

        <div className="flex items-center gap-4 mb-8 text-sm text-gray-500">
          <span>By {article.author}</span>
          <span>&middot;</span>
          <span>{article.source}</span>
          <span>&middot;</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>

        <div className="prose max-w-none">
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            {article.summary}
          </p>
          <div className="text-gray-800 leading-relaxed whitespace-pre-line">
            {article.content}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    )
  },
)

ArticleDetail.displayName = 'ArticleDetail'
