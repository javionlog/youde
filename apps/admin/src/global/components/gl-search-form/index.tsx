import type { ReactNode } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from 'tdesign-icons-react'
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
  const { className, style, columns, gap, maxRows = 1, items, ...formProps } = props

  const ref = useRef(null)
  const { breakpoint } = useScreen(ref?.current)
  const { t } = useTranslation()

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

  const btnVisible = useMemo(() => {
    return items.length > maxRows * finalColumn
  }, [items, maxRows, finalColumn])

  const [collapsed, setCollapsed] = useState(true)
  return (
    <div className={`gl-search-form ${className ?? ''}`} style={style}>
      <div ref={ref} className='flex gap-4'>
        <Form {...formProps} className='grow'>
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
        <div className='flex gap-4'>
          <div className='flex gap-4'>
            <Button>{t('action.query')}</Button>
            <Button variant='outline'>{t('action.reset')}</Button>
          </div>
        </div>
      </div>
      {btnVisible && (
        <Divider className='mt-2! mb-0!'>
          <Button variant='text' size='small' onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronDownIcon size='24px' /> : <ChevronUpIcon size='24px' />}
          </Button>
        </Divider>
      )}
    </div>
  )
}
