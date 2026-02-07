import { describe, it, expect } from 'vitest'
import { formatDate, formatRelativeTime } from '@/utils/formatDate'

describe('formatDate', () => {
  it('formats an ISO date string to readable format', () => {
    const result = formatDate('2025-12-15T10:30:00Z')
    expect(result).toContain('Dec')
    expect(result).toContain('15')
    expect(result).toContain('2025')
  })

  it('handles different date values', () => {
    const result = formatDate('2025-01-01T00:00:00Z')
    expect(result).toContain('Jan')
    expect(result).toContain('2025')
  })
})

describe('formatRelativeTime', () => {
  it('returns "just now" for very recent timestamps', () => {
    const now = new Date().toISOString()
    expect(formatRelativeTime(now)).toBe('just now')
  })

  it('returns minutes for recent timestamps', () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    expect(formatRelativeTime(fiveMinAgo)).toBe('5m ago')
  })

  it('returns hours for same-day timestamps', () => {
    const threeHoursAgo = new Date(
      Date.now() - 3 * 60 * 60 * 1000,
    ).toISOString()
    expect(formatRelativeTime(threeHoursAgo)).toBe('3h ago')
  })

  it('returns days for recent past', () => {
    const twoDaysAgo = new Date(
      Date.now() - 2 * 24 * 60 * 60 * 1000,
    ).toISOString()
    expect(formatRelativeTime(twoDaysAgo)).toBe('2d ago')
  })

  it('returns formatted date for old timestamps', () => {
    const result = formatRelativeTime('2024-01-15T10:30:00Z')
    expect(result).toContain('Jan')
    expect(result).toContain('2024')
  })
})
