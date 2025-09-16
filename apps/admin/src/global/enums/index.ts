import * as auth from './auth'

const enums = {
  ...auth
}

type Enums = typeof enums

type EnumKeys = keyof Enums

export const getOptions = <K extends EnumKeys>(key: K) => {
  return enums[key]
}

export const getValue = <K extends EnumKeys>(key: K) => {
  const item = enums[key].find(o => o.value)
  return item?.value
}

export const getTranslate = <K extends EnumKeys, V extends Enums[K][number]['value']>(
  key: K,
  value: V
) => {
  const item = enums[key].find(o => o.value === value)
  return item?.label
}
