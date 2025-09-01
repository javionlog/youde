import type { FormRule, InternalFormInstance } from 'tdesign-react'

export const isEmpty = (val: unknown): val is undefined | null | string | unknown[] => {
  return (
    val === undefined ||
    val === null ||
    (typeof val === 'string' && val.trim() === '') ||
    (Array.isArray(val) && val.length === 0)
  )
}

export const getRequiredRules = (
  opt?: Partial<FormRule & { form?: InternalFormInstance }>
): FormRule[] => {
  const { trigger = 'change', message = i18n.t('message.required'), form } = opt ?? {}
  useLocaleStore.subscribe(
    state => state.lang,
    () => {
      form?.validate()
    }
  )
  return [
    { required: true, message, trigger },
    {
      message,
      trigger,
      validator: val => !isEmpty(val)
    }
  ]
}
