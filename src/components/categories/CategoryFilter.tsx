import React from 'react'
import type { Category } from '@/types/category'

interface CategoryFilterProps {
  categories: Category[]
  activeCategory: string | null
  onCategorySelect: (slug: string | null) => void
}

export const CategoryFilter = React.memo<CategoryFilterProps>(
  ({ categories, activeCategory, onCategorySelect }) => {
    return (
      <ul className="space-y-1">
        <li>
          <button
            onClick={() => onCategorySelect(null)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
              activeCategory === null
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Categories
          </button>
        </li>
        {categories.map((cat) => (
          <li key={cat.id}>
            <button
              onClick={() => onCategorySelect(cat.slug)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm flex items-center gap-2 ${
                activeCategory === cat.slug
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              {cat.name}
              <span className="ml-auto text-xs text-gray-400">
                {cat.articleCount}
              </span>
            </button>
          </li>
        ))}
      </ul>
    )
  },
)

CategoryFilter.displayName = 'CategoryFilter'
