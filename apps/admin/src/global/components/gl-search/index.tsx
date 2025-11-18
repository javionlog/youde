import type { ReactNode } from 'react'
import { ChevronDownIcon, ChevronUpIcon, RollbackIcon, SearchIcon } from 'tdesign-icons-react'
import type { ButtonProps, FormItemProps, FormProps } from 'tdesign-react'

type GridProps = Omit<Parameters<typeof GlGrid>[0], 'collapsed'>
type GridItemProps = Parameters<typeof GlGridItem>[0]

type Item = {
  formItem?: FormItemProps
  gridItem?: GridItemProps
  component?: ReactNode
}

interface Props extends StyledProps, FormProps, GridProps {
  items: Item[]
  searchBtn?: ButtonProps
  resetBtn?: ButtonProps
}

export const GlSearch = (props: Props) => {
  const {
    className,
    style,
    columns,
    gap,
    maxRows = 1,
    items,
    searchBtn,
    resetBtn,
    ...formProps
  } = props

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

  const collpaseBtnVisible = useMemo(() => {
    return items.length > maxRows * finalColumn
  }, [items, maxRows, finalColumn])

  const [collapsed, setCollapsed] = useState(true)

  return (
    <div className={`gl-search ${className ?? ''}`} style={style}>
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
                <GlGridItem key={String(item.formItem?.name)} index={index} {...item.gridItem}>
                  <Form.FormItem
                    {...item.formItem}
                    label={<GlEllipsis>{item.formItem?.label}</GlEllipsis>}
                  >
                    {item.component}
                  </Form.FormItem>
                </GlGridItem>
              )
            })}
          </GlGrid>
        </Form>
        <div className='flex gap-4'>
          <div className='flex gap-4'>
            {finalColumn > 1 ? (
              <>
                <Button type='submit' {...searchBtn}>
                  {t('action.search')}
                </Button>{' '}
                <Button type='reset' variant='outline' {...resetBtn}>
                  {t('action.reset')}
                </Button>
              </>
            ) : (
              <>
                <Button
                  type='submit'
                  shape='square'
                  icon={<SearchIcon size='20px' />}
                  {...searchBtn}
                />{' '}
                <Button
                  type='reset'
                  variant='outline'
                  shape='square'
                  icon={<RollbackIcon size='20px' />}
                  {...resetBtn}
                />
              </>
            )}
          </div>
        </div>
      </div>
      {collpaseBtnVisible && (
        <Divider className='mt-2! mb-0!'>
          <Button variant='text' size='small' onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronDownIcon size='24px' /> : <ChevronUpIcon size='24px' />}
          </Button>
        </Divider>
      )}
    </div>
  )
}
