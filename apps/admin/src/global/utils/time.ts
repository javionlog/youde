import { format } from 'date-fns'

type FormatParams = Parameters<typeof format>

export const formatDate = (
  date: FormatParams[0] | undefined | null,
  formatStr?: FormatParams[1],
  options?: FormatParams[2]
) => {
  if (date === undefined || date === null) {
    return date
  }
  const defaultFormatStr = formatStr ?? 'yyyy-MM-dd HH:mm:ss'
  return format(date, defaultFormatStr, options)
}
