import { describe, it, expect } from 'vitest'
import {
  isValidEmail,
  isMinLength,
  isAlphanumeric,
  isRequired,
} from '@/utils/validators'

describe('validators', () => {
  describe('isValidEmail', () => {
    it('accepts valid emails', () => {
      expect(isValidEmail('user@example.com')).toBe(true)
      expect(isValidEmail('test.user@domain.co')).toBe(true)
      expect(isValidEmail('name+tag@gmail.com')).toBe(true)
    })

    it('rejects invalid emails', () => {
      expect(isValidEmail('not-an-email')).toBe(false)
      expect(isValidEmail('@domain.com')).toBe(false)
      expect(isValidEmail('')).toBe(false)
      expect(isValidEmail('user@')).toBe(false)
      expect(isValidEmail('user@.com')).toBe(false)
    })
  })

  describe('isMinLength', () => {
    it('returns true when value meets minimum length', () => {
      expect(isMinLength('abc', 3)).toBe(true)
      expect(isMinLength('abcd', 3)).toBe(true)
    })

    it('returns false when value is too short', () => {
      expect(isMinLength('ab', 3)).toBe(false)
      expect(isMinLength('', 1)).toBe(false)
    })
  })

  describe('isAlphanumeric', () => {
    it('accepts alphanumeric strings with underscores', () => {
      expect(isAlphanumeric('john_doe')).toBe(true)
      expect(isAlphanumeric('User123')).toBe(true)
      expect(isAlphanumeric('test')).toBe(true)
    })

    it('rejects strings with special characters', () => {
      expect(isAlphanumeric('user@name')).toBe(false)
      expect(isAlphanumeric('hello world')).toBe(false)
      expect(isAlphanumeric('user-name')).toBe(false)
    })
  })

  describe('isRequired', () => {
    it('returns true for non-empty strings', () => {
      expect(isRequired('hello')).toBe(true)
      expect(isRequired('a')).toBe(true)
    })

    it('returns false for empty or whitespace-only strings', () => {
      expect(isRequired('')).toBe(false)
      expect(isRequired('   ')).toBe(false)
    })
  })
})
