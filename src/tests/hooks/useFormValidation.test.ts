import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFormValidation } from '@/hooks/useFormValidation'

describe('useFormValidation', () => {
  const initialValues = { name: '', email: '' }
  const rules = {
    name: [
      {
        validate: (v: unknown) => (v as string).length >= 2,
        message: 'Name must be at least 2 characters',
      },
    ],
    email: [
      {
        validate: (v: unknown) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v as string),
        message: 'Invalid email',
      },
    ],
  }

  it('returns initial values', () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, rules),
    )
    expect(result.current.values).toEqual(initialValues)
    expect(result.current.errors).toEqual({})
    expect(result.current.touched).toEqual({})
    expect(result.current.isSubmitting).toBe(false)
  })

  it('handles field changes', () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, rules),
    )

    act(() => {
      result.current.handleChange('name', 'John')
    })

    expect(result.current.values.name).toBe('John')
  })

  it('validates field on blur', async () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, rules),
    )

    await act(async () => {
      await result.current.handleBlur('name')
    })

    expect(result.current.touched.name).toBe(true)
    expect(result.current.errors.name).toBe(
      'Name must be at least 2 characters',
    )
  })

  it('clears error on change', async () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, rules),
    )

    await act(async () => {
      await result.current.handleBlur('name')
    })
    expect(result.current.errors.name).toBeTruthy()

    act(() => {
      result.current.handleChange('name', 'John')
    })
    expect(result.current.errors.name).toBe('')
  })

  it('validates all fields on submit', async () => {
    const onSubmit = vi.fn()
    const { result } = renderHook(() =>
      useFormValidation(initialValues, rules),
    )

    const handler = result.current.handleSubmit(onSubmit)
    const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent

    await act(async () => {
      await handler(mockEvent)
    })

    expect(mockEvent.preventDefault).toHaveBeenCalled()
    expect(onSubmit).not.toHaveBeenCalled()
    expect(result.current.errors.name).toBeTruthy()
    expect(result.current.errors.email).toBeTruthy()
  })

  it('calls onSubmit when all fields valid', async () => {
    const onSubmit = vi.fn()
    const { result } = renderHook(() =>
      useFormValidation(initialValues, rules),
    )

    act(() => {
      result.current.handleChange('name', 'John')
      result.current.handleChange('email', 'john@example.com')
    })

    const handler = result.current.handleSubmit(onSubmit)
    const mockEvent = { preventDefault: vi.fn() } as unknown as React.FormEvent

    await act(async () => {
      await handler(mockEvent)
    })

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'John',
      email: 'john@example.com',
    })
  })

  it('supports async validation rules', async () => {
    const asyncRules = {
      name: [
        {
          validate: async (v: unknown) => {
            await new Promise((r) => setTimeout(r, 10))
            return (v as string).length >= 2
          },
          message: 'Too short',
        },
      ],
    }

    const { result } = renderHook(() =>
      useFormValidation({ name: '' }, asyncRules),
    )

    await act(async () => {
      await result.current.handleBlur('name')
    })

    expect(result.current.errors.name).toBe('Too short')
  })

  it('sets field error manually', () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, rules),
    )

    act(() => {
      result.current.setFieldError('name', 'Custom error')
    })

    expect(result.current.errors.name).toBe('Custom error')
  })

  it('resets form', async () => {
    const { result } = renderHook(() =>
      useFormValidation(initialValues, rules),
    )

    act(() => {
      result.current.handleChange('name', 'John')
    })

    await act(async () => {
      await result.current.handleBlur('name')
    })

    act(() => {
      result.current.resetForm()
    })

    expect(result.current.values).toEqual(initialValues)
    expect(result.current.errors).toEqual({})
    expect(result.current.touched).toEqual({})
  })
})
