import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RegisterForm } from '@/components/auth/RegisterForm'

const defaultProps = {
  values: { username: '', email: '', password: '', displayName: '' },
  errors: {},
  touched: {},
  isSubmitting: false,
  authError: null,
  isCheckingUsername: false,
  isUsernameAvailable: null as boolean | null,
  isCheckingEmail: false,
  isEmailAvailable: null as boolean | null,
  onChange: vi.fn(),
  onBlur: vi.fn(),
  onSubmit: vi.fn(),
}

describe('RegisterForm', () => {
  it('renders all form fields', () => {
    render(<RegisterForm {...defaultProps} />)
    expect(screen.getByLabelText('Username')).toBeInTheDocument()
    expect(screen.getByLabelText('Display Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })

  it('renders create account button', () => {
    render(<RegisterForm {...defaultProps} />)
    expect(
      screen.getByRole('button', { name: 'Create Account' }),
    ).toBeInTheDocument()
  })

  it('shows username availability check', () => {
    render(
      <RegisterForm {...defaultProps} isCheckingUsername={true} />,
    )
    expect(screen.getByText('Checking availability...')).toBeInTheDocument()
  })

  it('shows username available', () => {
    render(
      <RegisterForm {...defaultProps} isUsernameAvailable={true} />,
    )
    expect(screen.getByText('Username is available!')).toBeInTheDocument()
  })

  it('shows username taken', () => {
    render(
      <RegisterForm
        {...defaultProps}
        isUsernameAvailable={false}
        touched={{ username: true }}
      />,
    )
    expect(screen.getByText('Username is already taken')).toBeInTheDocument()
  })

  it('shows auth error', () => {
    render(
      <RegisterForm {...defaultProps} authError="Registration failed" />,
    )
    expect(screen.getByText('Registration failed')).toBeInTheDocument()
  })

  it('calls onChange on input change', () => {
    const onChange = vi.fn()
    render(<RegisterForm {...defaultProps} onChange={onChange} />)

    fireEvent.change(screen.getByLabelText('Username'), {
      target: { value: 'newuser' },
    })
    expect(onChange).toHaveBeenCalledWith('username', 'newuser')
  })

  it('disables button when submitting', () => {
    render(<RegisterForm {...defaultProps} isSubmitting={true} />)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
