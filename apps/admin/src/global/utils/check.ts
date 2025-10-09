import type { FormRule } from 'tdesign-react'

export const getRequiredRules = (opt?: Partial<FormRule>): FormRule[] => {
  const { trigger = 'change', message = i18n.t('message.required') } = opt ?? {}
  return [
    { required: true, message, trigger },
    {
      message,
      trigger,
      validator: val => !isEmpty(val)
    }
  ]
}
