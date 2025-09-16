import type { ReactNode } from 'react'

type GridProps = Parameters<typeof GlGrid>[0]
type GridItemProps = Parameters<typeof GlGridItem>[0]

type Item = {
  gridItem?: GridItemProps
  label: string | ReactNode
  content: string | ReactNode
}

interface Props extends StyledProps, GridProps {
  labelAlign?: 'left' | 'right' | 'top'
  labelWidth?: string | number
  labelEllipsis?: boolean
  contentEllipsis?: boolean
  items: Item[]
}

export const GlDescriptions = (props: Props) => {
  const {
    className,
    style,
    columns,
    gap,
    collapsed = false,
    maxRows,
    items,
    labelAlign = 'top',
    labelWidth = 80,
    labelEllipsis = true,
    contentEllipsis = true
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

  const itemLabelWidth = typeof labelWidth === 'number' ? `${labelWidth}px` : labelWidth
  return (
    <div ref={ref} className={`gl-descriptions ${className ?? ''}`} style={style}>
      <GlGrid
        columns={columns}
        gap={gap}
        collapsed={collapsed}
        maxRows={maxRows}
        targetColumn={finalColumn}
      >
        {items.map((item, index) => {
          const key = `${index}${Date.now().toString()}`
          return (
            <GlGridItem key={key} index={index} {...item.gridItem}>
              <div className={`flex ${labelAlign === 'top' ? 'flex-col gap-1' : 'gap-2'}`}>
                <div
                  className={`shrink-0 text-(--td-text-color-placeholder) ${labelAlign === 'right' ? 'text-right' : 'text-left'}`}
                  style={{ width: labelAlign === 'top' ? undefined : itemLabelWidth }}
                >
                  {labelEllipsis ? <GlEllipsis>{item.label}</GlEllipsis> : item.label}
                </div>
                <div className='min-w-0'>
                  {contentEllipsis ? <GlEllipsis>{item.content}</GlEllipsis> : item.content}
                </div>
              </div>
            </GlGridItem>
          )
        })}
      </GlGrid>
    </div>
  )
}
