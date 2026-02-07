import { useState, useEffect } from 'react'
import { useDebounce } from './useDebounce'

export function useAsyncValidation(
  value: string,
  validator: (val: string) => Promise<boolean>,
  delay = 500,
) {
  const debouncedValue = useDebounce(value, delay)
  const [isValidating, setIsValidating] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)

  useEffect(() => {
    if (!debouncedValue || debouncedValue.length < 3) {
      setIsAvailable(null)
      return
    }

    let cancelled = false
    setIsValidating(true)

    validator(debouncedValue)
      .then((result) => {
        if (!cancelled) setIsAvailable(result)
      })
      .catch(() => {
        if (!cancelled) setIsAvailable(null)
      })
      .finally(() => {
        if (!cancelled) setIsValidating(false)
      })

    return () => {
      cancelled = true
    }
  }, [debouncedValue, validator])

  return { isValidating, isAvailable }
}
