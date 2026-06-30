import * as auth from './auth'
import * as common from './common'
import * as treasure from './treasure'

const enums = {
  ...auth,
  ...common,
  ...treasure
}

export type Enums = typeof enums

export type EnumKeys = keyof Enums

export const getOptions = <K extends EnumKeys>(key: K) => {
  return enums[key]
}

export const getValue = <K extends EnumKeys, V extends Enums[K][number]['value']>(
  key: K,
  value: V
) => {
  const item = enums[key].find(o => o.value === value)
  return item ? (item.value as V) : undefined
}

export const getTranslate = <K extends EnumKeys, V extends Enums[K][number]['value']>(
  key: K,
  value: V
) => {
  const item = enums[key].find(o => o.value === value)
  return item?.label
}
