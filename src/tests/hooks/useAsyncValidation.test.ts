import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useAsyncValidation } from '@/hooks/useAsyncValidation'

describe('useAsyncValidation', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns null availability for short values', () => {
    const validator = vi.fn().mockResolvedValue(true)
    const { result } = renderHook(() =>
      useAsyncValidation('ab', validator, 300),
    )
    expect(result.current.isAvailable).toBeNull()
    expect(result.current.isValidating).toBe(false)
  })

  it('returns null availability for empty values', () => {
    const validator = vi.fn().mockResolvedValue(true)
    const { result } = renderHook(() =>
      useAsyncValidation('', validator, 300),
    )
    expect(result.current.isAvailable).toBeNull()
  })

  it('validates after debounce delay', async () => {
    vi.useRealTimers()
    const validator = vi.fn().mockResolvedValue(true)
    const { result } = renderHook(() =>
      useAsyncValidation('johndoe', validator, 100),
    )

    await waitFor(() => {
      expect(validator).toHaveBeenCalledWith('johndoe')
      expect(result.current.isAvailable).toBe(true)
    })
  })

  it('reports unavailable when validator returns false', async () => {
    vi.useRealTimers()
    const validator = vi.fn().mockResolvedValue(false)
    const { result } = renderHook(() =>
      useAsyncValidation('taken_name', validator, 100),
    )

    await waitFor(() => {
      expect(result.current.isAvailable).toBe(false)
    })
  })

  it('handles validator errors gracefully', async () => {
    vi.useRealTimers()
    const validator = vi.fn().mockRejectedValue(new Error('Network'))
    const { result } = renderHook(() =>
      useAsyncValidation('testuser', validator, 100),
    )

    await waitFor(() => {
      expect(result.current.isAvailable).toBeNull()
      expect(result.current.isValidating).toBe(false)
    })
  })
})
