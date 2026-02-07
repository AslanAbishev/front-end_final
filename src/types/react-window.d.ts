declare module 'react-window' {
  import type { CSSProperties, ReactNode } from 'react'

  interface ListChildProps {
    index: number
    style: CSSProperties
    data?: any
  }

  interface ListProps {
    children: (props: ListChildProps) => ReactNode
    height: number | string
    width: number | string
    itemCount: number
    itemSize: number
    itemData?: any
    className?: string
    style?: CSSProperties
    overscanCount?: number
  }

  export const List: React.ComponentType<ListProps>
}
