import type { ReactNode } from 'react'
import { GridContext } from './context'

type Column = { span?: number; offset?: number }

interface Props extends StyledProps {
  children?: ReactNode
  column?: Column
  index: number
}

export const GlGridItem = (props: Props) => {
  const { children, style, className, column, index } = props

  const { column: maxColumn, gap, collapsed, maxRows } = useContext(GridContext)

  const colGap = useMemo(() => {
    if (Array.isArray(gap)) {
      return gap[1]
    }
    return gap
  }, [gap])

  const defaultStyle = useMemo(() => {
    const span = column?.span ?? 1
    const offset = column?.offset ?? 0
    const width = span + offset
    const safeSpan = Math.max(1, Math.min(span, maxColumn))
    const safeOffset = Math.max(0, Math.min(offset, maxColumn))
    const safeWidth = Math.min(width, maxColumn)
    const itemVisible = index + 1 <= maxRows * maxColumn
    const finalWidth = safeWidth > 1 ? `span ${safeWidth}` : undefined
    const finalSpan = safeSpan > 1 ? `span ${safeSpan}` : undefined
    const finalMarginLeft = `calc(((100% + ${colGap}px) / ${safeWidth}) * ${safeOffset})`
    return {
      gridColumn: offset > 0 ? finalWidth : finalSpan,
      marginLeft: offset > 0 && safeOffset < safeWidth ? finalMarginLeft : undefined,
      display: collapsed && !itemVisible ? 'none' : undefined
    }
  }, [column, maxColumn, collapsed, index, maxRows, colGap])

  return (
    <div
      className={`gl-grid-item min-w-0 ${className ?? ''}`}
      style={{ ...defaultStyle, ...style }}
    >
      {children}
    </div>
  )
}
