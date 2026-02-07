import React from 'react'
import { useParams } from 'react-router-dom'
import { ArticleFeedContainer } from './ArticleFeedContainer'

export const CategoryFeedContainer: React.FC = () => {
  const { category } = useParams<{ category: string }>()
  return <ArticleFeedContainer categorySlug={category} />
}
