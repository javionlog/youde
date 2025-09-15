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
    labelWidth = 100,
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
              {labelAlign === 'top' ? (
                <div className='flex flex-col gap-1'>
                  <div className='text-(--td-text-color-placeholder)'>
                    {labelEllipsis ? (
                      <GlEllipsis content={item.label}>{item.label}</GlEllipsis>
                    ) : (
                      item.label
                    )}
                  </div>
                  <div>
                    {' '}
                    {contentEllipsis ? (
                      <GlEllipsis content={item.content}>{item.content}</GlEllipsis>
                    ) : (
                      item.content
                    )}
                  </div>
                </div>
              ) : (
                <div className='flex gap-3'>
                  <div
                    className={`text-(--td-text-color-placeholder) ${labelAlign === 'left' ? 'text-left' : 'text-right'}`}
                    style={{ width: itemLabelWidth }}
                  >
                    {labelEllipsis ? (
                      <GlEllipsis content={item.label}>{item.label}</GlEllipsis>
                    ) : (
                      item.label
                    )}
                  </div>
                  <div className='min-w-0'>
                    {contentEllipsis ? (
                      <GlEllipsis content={item.content}>{item.content}</GlEllipsis>
                    ) : (
                      item.content
                    )}
                  </div>
                </div>
              )}
            </GlGridItem>
          )
        })}
      </GlGrid>
    </div>
  )
}
