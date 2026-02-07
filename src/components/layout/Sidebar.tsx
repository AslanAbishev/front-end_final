import React from 'react'
import type { Category } from '@/types/category'
import { CategoryFilter } from '@/components/categories/CategoryFilter'

interface SidebarProps {
  categories: Category[]
  activeCategory: string | null
  onCategorySelect: (slug: string | null) => void
}

export const Sidebar = React.memo<SidebarProps>(
  ({ categories, activeCategory, onCategorySelect }) => {
    return (
      <aside className="w-64 shrink-0 hidden lg:block">
        <div className="sticky top-20">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Categories
          </h2>
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategorySelect={onCategorySelect}
          />
        </div>
      </aside>
    )
  },
)

Sidebar.displayName = 'Sidebar'
