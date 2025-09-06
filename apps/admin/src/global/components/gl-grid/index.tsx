import type { ReactNode } from 'react'
import { MaxColumnContext } from './context'

export { GlGridItem } from './grid-item'

type Columns = {
  [key in ScreenSizeKey]: number
}

interface Props extends StyledProps {
  columns?: Columns
  gap?: number
  children?: ReactNode
}

export const GlGrid = (props: Props) => {
  const {
    children,
    className,
    style,
    gap = '16',
    columns = {
      xs: 1,
      sm: 2,
      md: 3,
      lg: 4,
      xl: 5,
      '2xl': 6
    }
  } = props

  const ref = useRef(null)
  const { breakpoint } = useScreen(ref?.current)
  const finalColumn = useMemo(() => {
    return columns[breakpoint]
  }, [breakpoint, columns])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        gap: `${gap}px`,
        display: 'grid',
        gridTemplateColumns: `repeat(${finalColumn}, 1fr)`,
        ...style
      }}
    >
      <MaxColumnContext value={finalColumn}>{children}</MaxColumnContext>
    </div>
  )
}
