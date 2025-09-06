import type { ReactNode } from 'react'
import { MaxColumnContext } from './context'

interface Props extends StyledProps {
  children?: ReactNode
  maxColumn?: number
  index?: number
  column?: {
    [key in ScreenSizeKey]: { span: number; offset: number }
  }
}

export const GlGridItem = (props: Props) => {
  const {
    children,
    column = {
      xs: { span: 0, offset: 0 },
      sm: { span: 0, offset: 0 },
      md: { span: 0, offset: 0 },
      lg: { span: 0, offset: 0 },
      xl: { span: 0, offset: 0 },
      '2xl': { span: 0, offset: 0 }
    }
  } = props
  const { breakpoint } = useScreen()
  const maxColumn = useContext(MaxColumnContext)

  const style = useMemo(() => {
    const span = column[breakpoint].span
    const offset = column[breakpoint].offset
    const safeSpan = Math.max(1, Math.min(span, maxColumn))
    const safeOffset = Math.max(0, Math.min(offset, maxColumn))
    return {
      gridColumn: `span ${safeSpan}`,
      marginLeft:
        offset > 0 ? `calc(((100% + 16px) / ${safeSpan + safeOffset}) * ${safeOffset})` : undefined
    }
  }, [breakpoint, column, maxColumn])

  return <div style={style}>{children}</div>
}
