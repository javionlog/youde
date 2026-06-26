import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react'
import { GlGridItem, type GridItemInternalProps } from './grid-item'

export { GlGridItem } from './grid-item'

type Columns =
  | {
      [key in ScreenSizeKey]: number
    }
  | number

interface Props extends StyledProps {
  children?: ReactNode
  columns?: Columns
  justifyContent?: 'start' | 'end' | 'center' | 'stretch'
  alignItems?: 'start' | 'end' | 'center' | 'stretch'
  gap?: number | number[]
  collapsed?: boolean
  maxRows?: number
  targetColumn?: number
}

export const GlGrid = (props: Props) => {
  const {
    children,
    className,
    style,
    justifyContent,
    alignItems = 'center',
    columns,
    gap = 16,
    collapsed = true,
    maxRows = 1,
    targetColumn
  } = props
  const ref = useRef(null)
  const { breakpoint } = useScreen(ref?.current)

  const finalColumn = useMemo(() => {
    if (columns === undefined) {
      const defaultColumns = {
        xs: 1,
        sm: 2,
        md: 3,
        lg: 4,
        xl: 5,
        '2xl': 6
      }
      return defaultColumns[breakpoint]
    }
    if (typeof columns === 'object') {
      return columns[breakpoint]
    }
    return 3
  }, [breakpoint, columns])

  const finalGap = useMemo(() => {
    if (Array.isArray(gap)) {
      return `${gap[0]}px ${gap[1]}px`
    }
    return `${gap}px`
  }, [gap])

  const colGap = Array.isArray(gap) ? gap[1] : gap
  const column = targetColumn ?? finalColumn
  const maxVisible = maxRows * column
  let usedCols = 0
  const processedChildren = Children.map(children, child => {
    if (isValidElement(child) && child.type === GlGridItem) {
      const childProps = child.props as { column?: { span?: number; offset?: number } }
      const span = childProps.column?.span ?? 1
      const offset = childProps.column?.offset ?? 0
      const safeSpan = Math.max(1, Math.min(span, column))
      const safeOffset = Math.max(0, Math.min(offset, column - safeSpan))
      const safeWidth = safeSpan + safeOffset
      const hidden = collapsed && usedCols + safeWidth > maxVisible
      usedCols += safeWidth
      const gridColumn = safeWidth > 1 ? `span ${safeWidth}` : undefined
      const marginLeft =
        safeOffset > 0 ? `calc((100% + ${colGap}px) / ${safeWidth} * ${safeOffset})` : undefined
      return cloneElement(
        child as ReactElement<GridItemInternalProps>,
        { _hidden: hidden, _gridColumn: gridColumn, _marginLeft: marginLeft }
      )
    }
    return child
  })

  return (
    <div
      ref={ref}
      className={`gl-grid ${className ?? ''}`}
      style={{
        display: 'grid',
        gap: `${finalGap}`,
        gridTemplateColumns: `repeat(${column}, 1fr)`,
        justifyContent,
        alignItems,
        ...style
      }}
    >
      {processedChildren}
    </div>
  )
}
