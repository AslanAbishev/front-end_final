import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SettingsForm } from '@/components/settings/SettingsForm'
import type { Category } from '@/types/category'

const mockCategories: Category[] = [
  { id: 'cat-tech', name: 'Technology', slug: 'technology', description: '', color: '#3B82F6', articleCount: 5 },
  { id: 'cat-science', name: 'Science', slug: 'science', description: '', color: '#10B981', articleCount: 3 },
]

const defaultProps = {
  values: {
    username: 'johndoe',
    email: 'john@example.com',
    displayName: 'John Doe',
    preferredCategories: ['cat-tech'],
    displayMode: 'grid' as const,
    articlesPerPage: 10,
    theme: 'light' as const,
  },
  errors: {},
  touched: {},
  isSubmitting: false,
  categories: mockCategories,
  isCheckingUsername: false,
  isUsernameAvailable: null as boolean | null,
  onChange: vi.fn(),
  onBlur: vi.fn(),
  onSubmit: vi.fn(),
}

describe('SettingsForm', () => {
  it('renders profile settings section', () => {
    render(<SettingsForm {...defaultProps} />)
    expect(screen.getByText('Profile Settings')).toBeInTheDocument()
    expect(screen.getByDisplayValue('johndoe')).toBeInTheDocument()
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
  })

  it('renders preferred categories', () => {
    render(<SettingsForm {...defaultProps} />)
    expect(screen.getByText('Preferred Categories')).toBeInTheDocument()
    expect(screen.getByText('Technology')).toBeInTheDocument()
    expect(screen.getByText('Science')).toBeInTheDocument()
  })

  it('renders display preferences', () => {
    render(<SettingsForm {...defaultProps} />)
    expect(screen.getByText('Display Preferences')).toBeInTheDocument()
    expect(screen.getByText('Display Mode')).toBeInTheDocument()
    expect(screen.getByText('Theme')).toBeInTheDocument()
  })

  it('calls onChange when category is toggled', () => {
    const onChange = vi.fn()
    render(<SettingsForm {...defaultProps} onChange={onChange} />)

    fireEvent.click(screen.getByText('Science'))
    expect(onChange).toHaveBeenCalledWith('preferredCategories', [
      'cat-tech',
      'cat-science',
    ])
  })

  it('calls onChange when display mode changes', () => {
    const onChange = vi.fn()
    render(<SettingsForm {...defaultProps} onChange={onChange} />)

    fireEvent.click(screen.getByLabelText('list'))
    expect(onChange).toHaveBeenCalledWith('displayMode', 'list')
  })

  it('calls onChange when theme changes', () => {
    const onChange = vi.fn()
    render(<SettingsForm {...defaultProps} onChange={onChange} />)

    fireEvent.click(screen.getByLabelText('dark'))
    expect(onChange).toHaveBeenCalledWith('theme', 'dark')
  })

  it('shows save button', () => {
    render(<SettingsForm {...defaultProps} />)
    expect(
      screen.getByRole('button', { name: 'Save Settings' }),
    ).toBeInTheDocument()
  })

  it('disables save button when submitting', () => {
    render(<SettingsForm {...defaultProps} isSubmitting={true} />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('shows username checking status', () => {
    render(
      <SettingsForm {...defaultProps} isCheckingUsername={true} />,
    )
    expect(screen.getByText('Checking availability...')).toBeInTheDocument()
  })
})
