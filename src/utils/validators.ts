export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isMinLength(value: string, min: number): boolean {
  return value.length >= min
}

export function isAlphanumeric(value: string): boolean {
  return /^[a-zA-Z0-9_]+$/.test(value)
}

export function isRequired(value: string): boolean {
  return value.trim().length > 0
}
