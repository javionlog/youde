import type { ReactNode } from 'react'
import type { FormItemProps, FormProps } from 'tdesign-react'

type GridProps = Omit<Parameters<typeof GlGrid>[0], 'collapsed'>
type GridItemProps = Parameters<typeof GlGridItem>[0]

type Item = {
  formItemProps?: FormItemProps
  gridItemProps?: GridItemProps
  component?: ReactNode
}

interface Props extends FormProps, GridProps {
  items: Item[]
}

export const GlSearchForm = (props: Props) => {
  const { columns, gap, maxRows = 1, items, ...formProps } = props

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

  const visibleItems = useMemo(() => {
    return items.filter((_item, index) => {
      return index + 1 <= maxRows * finalColumn
    })
  }, [items, maxRows, finalColumn])

  const [collapsed, setCollapsed] = useState(true)
  return (
    <div ref={ref} className='flex gap-4'>
      <Form {...formProps} className='grow-1'>
        <GlGrid
          columns={columns}
          gap={gap}
          collapsed={collapsed}
          maxRows={maxRows}
          targetColumn={finalColumn}
        >
          {items.map((item, index) => {
            return (
              <GlGridItem
                key={String(item.formItemProps?.name)}
                index={index}
                {...item.gridItemProps}
              >
                <Form.FormItem {...item.formItemProps}>{item.component}</Form.FormItem>
              </GlGridItem>
            )
          })}
        </GlGrid>
      </Form>
      <Space>
        <Space direction={visibleItems.length > finalColumn ? 'vertical' : 'horizontal'}>
          <Button>查询</Button>
          <Button variant='outline'>重置</Button>
        </Space>
        {items.length > maxRows * finalColumn && (
          <Button variant='text' onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? '展开' : '收起'}
          </Button>
        )}
      </Space>
    </div>
  )
}
