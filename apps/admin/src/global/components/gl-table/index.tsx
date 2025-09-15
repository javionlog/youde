import type { ReactNode } from 'react'
import type { FormProps, PaginationProps, TableProps } from 'tdesign-react'

type SearchProps = Parameters<typeof GlSearch>[0]
type FetchResponse = Promise<{
  data: {
    records: any[]
    total: number
  }
}>
interface Props extends StyledProps, TableProps {
  search?: SearchProps
  fetch?: (...args: any[]) => any
  operation?: ReactNode
}

export const GlTable = (props: Props) => {
  const { className, style, search, fetch, operation, pagination, columns, ...tableProps } = props

  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [tableData, setTableData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [current, setCurrent, getCurrent] = useGetState(1)
  const [pageSize, setPageSize, getPageSize] = useGetState(10)
  const tableRef = useRef<HTMLDivElement>(null)

  const { height } = useAutoHeight(tableRef.current, {
    afterTarget: tableRef.current?.querySelector('.t-table__pagination-wrap'),
    afterHeight: 40
  })

  useEffect(() => {
    if (fetch) {
      form.submit()
    }
  }, [])

  const tableColumns = (columns as TalbeColumns)?.map(item => {
    return {
      ellipsis: true,
      cell: ({ row, col }) => {
        if (item.cellRenderType === 'boolean') {
          return row[col.colKey!] ? t('label.yes') : t('label.no')
        }
        if (item.cellRenderType === 'date') {
          return formatDate(row[col.colKey!], 'yyyy-MM-dd')
        }
        if (item.cellRenderType === 'datetime') {
          return formatDate(row[col.colKey!], 'yyyy-MM-dd HH:mm:ss')
        }

        return row[col.colKey!]
      },
      ...item
    } satisfies TalbeColumns[number] & TableExtendColumn
  })

  const searchBtn = {
    onClick: () => {
      setCurrent(1)
      form.submit()
    },
    ...search?.searchBtn
  } satisfies SearchProps['searchBtn']

  const resetBtn = {
    onClick: () => {
      setCurrent(1)
      setPageSize(10)
      form.reset()
    },
    ...search?.resetBtn
  } satisfies SearchProps['resetBtn']

  const onSubmit: FormProps['onSubmit'] = async ({ validateResult }) => {
    if (validateResult === true) {
      const params = {
        ...form.getFieldsValue(true),
        page: getCurrent(),
        pageSize: getPageSize()
      }
      if (fetch) {
        setLoading(true)
        try {
          const { records, total } = await (fetch({ body: params }) as FetchResponse).then(
            r => r.data
          )
          setTableData(records)
          setTotal(total)
        } finally {
          setLoading(false)
        }
      }
    }
  }

  const onReset: FormProps['onReset'] = () => {
    form.submit()
  }

  const onCurrentChange: PaginationProps['onCurrentChange'] = current => {
    setCurrent(current)
  }

  const onPageSizeChange: PaginationProps['onPageSizeChange'] = pageSize => {
    setPageSize(pageSize)
    form.submit()
  }
  const defaultClassName = 'gl-table flex flex-col gap-5'
  return (
    <div className={`${defaultClassName} ${className ?? ''}`} style={style}>
      {search && (
        <GlSearch
          form={form}
          onSubmit={onSubmit}
          onReset={onReset}
          searchBtn={{ loading, ...searchBtn }}
          resetBtn={{ loading, ...resetBtn }}
          {...search}
        />
      )}
      {operation}
      <div ref={tableRef}>
        <Table
          data={tableProps.data ?? tableData}
          bordered={tableProps.bordered ?? true}
          tableLayout={tableProps.tableLayout ?? 'auto'}
          loading={tableProps.loading ?? loading}
          maxHeight={tableProps.maxHeight ?? height}
          columns={tableColumns}
          pagination={
            fetch
              ? { total, current, pageSize, onCurrentChange, onPageSizeChange, disabled: loading }
              : pagination
          }
          {...tableProps}
        />
      </div>
    </div>
  )
}
