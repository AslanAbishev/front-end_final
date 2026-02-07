import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { SearchBar } from '@/components/common/SearchBar'

describe('SearchBar', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders with placeholder', () => {
    render(<SearchBar value="" onSearch={vi.fn()} />)
    expect(
      screen.getByPlaceholderText('Search articles...'),
    ).toBeInTheDocument()
  })

  it('renders with custom placeholder', () => {
    render(
      <SearchBar
        value=""
        onSearch={vi.fn()}
        placeholder="Search here..."
      />,
    )
    expect(screen.getByPlaceholderText('Search here...')).toBeInTheDocument()
  })

  it('displays initial value', () => {
    render(<SearchBar value="react" onSearch={vi.fn()} />)
    expect(screen.getByDisplayValue('react')).toBeInTheDocument()
  })

  it('calls onSearch after debounce', () => {
    const onSearch = vi.fn()
    render(<SearchBar value="" onSearch={onSearch} />)

    const input = screen.getByLabelText('Search articles')
    fireEvent.change(input, { target: { value: 'test' } })

    expect(onSearch).not.toHaveBeenCalledWith('test')

    act(() => {
      vi.advanceTimersByTime(300)
    })

    expect(onSearch).toHaveBeenCalledWith('test')
  })

  it('shows clear button when there is input', () => {
    render(<SearchBar value="test" onSearch={vi.fn()} />)
    expect(screen.getByLabelText('Clear search')).toBeInTheDocument()
  })

  it('does not show clear button when input is empty', () => {
    render(<SearchBar value="" onSearch={vi.fn()} />)
    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument()
  })

  it('clears input when clear button is clicked', () => {
    const onSearch = vi.fn()
    render(<SearchBar value="test" onSearch={onSearch} />)

    fireEvent.click(screen.getByLabelText('Clear search'))
    expect(screen.getByDisplayValue('')).toBeInTheDocument()
  })
})
