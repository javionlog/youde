export const YES_NO = [
  {
    label: i18n.t('label.yes'),
    value: true
  },
  {
    label: i18n.t('label.no'),
    value: false
  }
] satisfies {
  label: string
  value: boolean
}[]
