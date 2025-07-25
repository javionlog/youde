export const isEmpty = (val: unknown): val is undefined | null | string | unknown[] => {
  return (
    val === undefined ||
    val === null ||
    (typeof val === 'string' && val.trim() === '') ||
    (Array.isArray(val) && val.length === 0)
  )
}
