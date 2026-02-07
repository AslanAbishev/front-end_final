import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { LoginForm } from '@/components/auth/LoginForm'

const defaultProps = {
  values: { email: '', password: '' },
  errors: {},
  touched: {},
  isSubmitting: false,
  authError: null,
  onChange: vi.fn(),
  onBlur: vi.fn(),
  onSubmit: vi.fn(),
}

describe('LoginForm', () => {
  it('renders email and password fields', () => {
    render(<LoginForm {...defaultProps} />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })

  it('renders submit button', () => {
    render(<LoginForm {...defaultProps} />)
    expect(
      screen.getByRole('button', { name: 'Sign In' }),
    ).toBeInTheDocument()
  })

  it('shows loading state when submitting', () => {
    render(<LoginForm {...defaultProps} isSubmitting={true} />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('displays auth error', () => {
    render(
      <LoginForm {...defaultProps} authError="Invalid credentials" />,
    )
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
  })

  it('displays field errors when touched', () => {
    render(
      <LoginForm
        {...defaultProps}
        errors={{ email: 'Invalid email' }}
        touched={{ email: true }}
      />,
    )
    expect(screen.getByText('Invalid email')).toBeInTheDocument()
  })

  it('calls onChange when typing', () => {
    const onChange = vi.fn()
    render(<LoginForm {...defaultProps} onChange={onChange} />)

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@test.com' },
    })
    expect(onChange).toHaveBeenCalledWith('email', 'test@test.com')
  })

  it('calls onBlur when field loses focus', () => {
    const onBlur = vi.fn()
    render(<LoginForm {...defaultProps} onBlur={onBlur} />)

    fireEvent.blur(screen.getByLabelText('Email'))
    expect(onBlur).toHaveBeenCalledWith('email')
  })

  it('calls onSubmit when form is submitted', () => {
    const onSubmit = vi.fn((e) => e.preventDefault())
    render(<LoginForm {...defaultProps} onSubmit={onSubmit} />)

    fireEvent.submit(screen.getByRole('button', { name: 'Sign In' }))
    expect(onSubmit).toHaveBeenCalled()
  })
})
