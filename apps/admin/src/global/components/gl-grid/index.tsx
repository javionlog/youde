import type { ReactNode } from 'react'
import { GridContext } from './context'

export { GlGridItem } from './grid-item'

type Columns =
  | {
      [key in ScreenSizeKey]: number
    }
  | number

interface Props extends StyledProps {
  children?: ReactNode
  columns?: Columns
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

  return (
    <div
      ref={ref}
      className={`gl-grid ${className ?? ''}`}
      style={{
        display: 'grid',
        gap: `${finalGap}`,
        gridTemplateColumns: `repeat(${targetColumn ?? finalColumn}, 1fr)`,
        ...style
      }}
    >
      <GridContext
        value={{
          column: targetColumn ?? finalColumn,
          gap,
          collapsed,
          maxRows
        }}
      >
        {children}
      </GridContext>
    </div>
  )
}
