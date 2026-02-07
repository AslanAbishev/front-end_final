import React from 'react'
import type { Article } from '@/types/article'
import type { Bookmark } from '@/types/bookmark'
import { ArticleCard } from '@/components/articles/ArticleCard'

interface BookmarkListProps {
  bookmarks: Bookmark[]
  articles: Article[]
  onBookmarkToggle: (articleId: string) => void
  onArticleClick: (articleId: string) => void
}

export const BookmarkList = React.memo<BookmarkListProps>(
  ({ bookmarks, articles, onBookmarkToggle, onArticleClick }) => {
    const bookmarkedArticles = articles.filter((a) =>
      bookmarks.some((b) => b.articleId === a.id),
    )

    if (bookmarkedArticles.length === 0) {
      return (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <p className="text-gray-500 text-lg">No bookmarks yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Save articles to read them later
          </p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookmarkedArticles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            isBookmarked={true}
            onBookmarkToggle={onBookmarkToggle}
            onClick={onArticleClick}
          />
        ))}
      </div>
    )
  },
)

BookmarkList.displayName = 'BookmarkList'
