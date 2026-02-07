import React from 'react'

interface CategoryBadgeProps {
  name: string
  color: string
}

export const CategoryBadge = React.memo<CategoryBadgeProps>(
  ({ name, color }) => {
    return (
      <span
        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
        style={{ backgroundColor: color }}
      >
        {name}
      </span>
    )
  },
)

CategoryBadge.displayName = 'CategoryBadge'
