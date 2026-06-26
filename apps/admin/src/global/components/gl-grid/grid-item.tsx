import type { ReactNode } from 'react'
import { GridContext } from './context'

type Column = { span?: number; offset?: number }

interface Props extends StyledProps {
  children?: ReactNode
  column?: Column
  /** @internal injected by GlGrid via cloneElement, do not pass manually */
  hidden?: boolean
}

export const GlGridItem = (props: Props) => {
  const { children, style, className, column, hidden } = props

  const { column: maxColumn, gap } = useContext(GridContext)

  const colGap = useMemo(() => {
    if (Array.isArray(gap)) {
      return gap[1]
    }
    return gap
  }, [gap])

  const defaultStyle = useMemo(() => {
    const span = column?.span ?? 1
    const offset = column?.offset ?? 0
    const safeSpan = Math.max(1, Math.min(span, maxColumn))
    const safeOffset = Math.max(0, Math.min(offset, maxColumn - safeSpan))
    const safeWidth = safeSpan + safeOffset
    const gridColumn = safeWidth > 1 ? `span ${safeWidth}` : undefined
    const marginLeft =
      safeOffset > 0
        ? `calc((100% + ${colGap}px) / ${safeWidth} * ${safeOffset})`
        : undefined
    return {
      gridColumn,
      marginLeft,
      display: hidden ? 'none' : undefined
    }
  }, [column, maxColumn, hidden, colGap])

  return (
    <div
      className={`gl-grid-item min-w-0 ${className ?? ''}`}
      style={{ ...defaultStyle, ...style }}
    >
      {children}
    </div>
  )
}
