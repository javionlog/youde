export const YES_NO = [
  {
    get label() {
      return 'Yes'
    },
    value: true
  },
  {
    get label() {
      return 'No'
    },
    value: false
  }
] satisfies {
  label: string
  value: boolean
}[]
