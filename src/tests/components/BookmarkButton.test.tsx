import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BookmarkButton } from '@/components/bookmarks/BookmarkButton'

describe('BookmarkButton', () => {
  it('shows "Add bookmark" label when not bookmarked', () => {
    render(<BookmarkButton isBookmarked={false} onToggle={vi.fn()} />)
    expect(screen.getByLabelText('Add bookmark')).toBeInTheDocument()
  })

  it('shows "Remove bookmark" label when bookmarked', () => {
    render(<BookmarkButton isBookmarked={true} onToggle={vi.fn()} />)
    expect(screen.getByLabelText('Remove bookmark')).toBeInTheDocument()
  })

  it('calls onToggle when clicked', () => {
    const onToggle = vi.fn()
    render(<BookmarkButton isBookmarked={false} onToggle={onToggle} />)
    fireEvent.click(screen.getByLabelText('Add bookmark'))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('stops event propagation', () => {
    const parentClick = vi.fn()
    const onToggle = vi.fn()
    render(
      <div onClick={parentClick}>
        <BookmarkButton isBookmarked={false} onToggle={onToggle} />
      </div>,
    )
    fireEvent.click(screen.getByLabelText('Add bookmark'))
    expect(onToggle).toHaveBeenCalled()
    expect(parentClick).not.toHaveBeenCalled()
  })
})
