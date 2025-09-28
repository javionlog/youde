export const YES_NO = [
  {
    get label() {
      return i18n.t('label.yes', { lng: i18n.language })
    },
    value: true
  },
  {
    get label() {
      return i18n.t('label.no', { lng: i18n.language })
    },
    value: false
  }
] satisfies {
  label: string
  value: boolean
}[]
