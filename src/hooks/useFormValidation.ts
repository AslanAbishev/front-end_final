import { useState, useCallback, useRef } from 'react'

type ValidateFn<T> = (
  value: T[keyof T],
  values: T,
) => boolean | Promise<boolean>

export interface ValidationRule<T> {
  validate: ValidateFn<T>
  message: string
}

type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule<T>[]
}

export interface FormValidationReturn<T> {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isSubmitting: boolean
  isValid: boolean
  handleChange: (field: keyof T, value: unknown) => void
  handleBlur: (field: keyof T) => Promise<void>
  handleSubmit: (
    onSubmit: (values: T) => Promise<void>,
  ) => (e: React.FormEvent) => void
  setFieldError: (field: keyof T, message: string) => void
  resetForm: () => void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  rules: ValidationRules<T>,
): FormValidationReturn<T> {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const rulesRef = useRef(rules)
  rulesRef.current = rules

  const validateField = useCallback(
    async (field: keyof T, value: T[keyof T], allValues: T) => {
      const fieldRules = rulesRef.current[field]
      if (!fieldRules) return ''
      for (const rule of fieldRules) {
        const isFieldValid = await rule.validate(value, allValues)
        if (!isFieldValid) return rule.message
      }
      return ''
    },
    [],
  )

  const handleChange = useCallback((field: keyof T, value: unknown) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }, [])

  const handleBlur = useCallback(
    async (field: keyof T) => {
      setTouched((prev) => ({ ...prev, [field]: true }))
      const error = await validateField(field, values[field], values)
      setErrors((prev) => ({ ...prev, [field]: error }))
    },
    [values, validateField],
  )

  const handleSubmit = useCallback(
    (onSubmit: (values: T) => Promise<void>) => {
      return async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const newErrors: Partial<Record<keyof T, string>> = {}
        const allTouched: Partial<Record<keyof T, boolean>> = {}
        let hasErrors = false

        for (const field of Object.keys(values) as (keyof T)[]) {
          allTouched[field] = true
          const error = await validateField(field, values[field], values)
          if (error) {
            newErrors[field] = error
            hasErrors = true
          }
        }

        setTouched(allTouched)
        setErrors(newErrors)

        if (!hasErrors) {
          try {
            await onSubmit(values)
          } catch (err) {
            setErrors((prev) => ({
              ...prev,
              _form: (err as Error).message,
            }))
          }
        }

        setIsSubmitting(false)
      }
    },
    [values, validateField],
  )

  const setFieldError = useCallback((field: keyof T, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }))
  }, [])

  const resetForm = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  const isValid =
    Object.values(errors).every((e) => !e) &&
    Object.keys(touched).length > 0

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldError,
    resetForm,
  }
}
