type ConvertDate<T> = T extends Date ? string : T

export const convertDateValues = <T extends Record<PropertyKey, unknown>>(value: T) => {
  return Object.fromEntries(
    Object.entries(value).map(([k, v]) => {
      if (v instanceof Date) {
        return [k, v.toISOString()]
      }
      return [k, v]
    })
  ) as {
    [K in keyof T]: ConvertDate<T[K]>
  }
}

export const convertDateToString = (value: number | string | Date) => {
  return new Date(value).toISOString()
}
