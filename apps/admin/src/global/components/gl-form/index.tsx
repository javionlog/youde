import type { ReactNode } from 'react'
import type { FormItemProps, FormProps } from 'tdesign-react'

type GridProps = Parameters<typeof GlGrid>[0]
type GridItemProps = Parameters<typeof GlGridItem>[0]

type Item = {
  formItem?: FormItemProps
  gridItem?: GridItemProps
  component?: ReactNode
}

interface Props extends StyledProps, FormProps, GridProps {
  items: Item[]
}

export const GlForm = (props: Props) => {
  const { className, style, columns, gap, collapsed = false, maxRows, items, ...formProps } = props

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

  return (
    <div ref={ref} className={`gl-form ${className ?? ''}`} style={style}>
      <Form {...formProps}>
        <GlGrid
          columns={columns}
          gap={gap}
          collapsed={collapsed}
          maxRows={maxRows}
          targetColumn={finalColumn}
        >
          {items.map((item, index) => {
            return (
              <GlGridItem key={String(item.formItem?.name)} index={index} {...item.gridItem}>
                <Form.FormItem {...item.formItem}>{item.component}</Form.FormItem>
              </GlGridItem>
            )
          })}
        </GlGrid>
      </Form>
    </div>
  )
}
