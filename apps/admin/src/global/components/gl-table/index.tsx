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
}

export const GlTable = (props: Props) => {
  const { className, style, search, fetch, pagination, columns, ...tableProps } = props

  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [tableData, setTableData] = useState<any[]>([])
  const [tableLoading, setTableLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)

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

  const queryBtn = {
    onClick: () => {
      form.submit()
    },
    ...search?.queryBtn
  } satisfies SearchProps['queryBtn']

  const resetBtn = {
    onClick: () => {
      form.reset()
    },
    ...search?.resetBtn
  } satisfies SearchProps['resetBtn']

  const onSubmit: FormProps['onSubmit'] = async ({ validateResult }) => {
    if (validateResult === true) {
      setCurrent(1)
      const params = {
        ...form.getFieldsValue(true),
        page: current,
        pageSize: pageSize
      }
      if (fetch) {
        setTableLoading(true)
        try {
          const { records, total } = await (fetch({ body: params }) as FetchResponse).then(
            r => r.data
          )
          setTableData(records)
          setTotal(total)
        } finally {
          setTableLoading(false)
        }
      }
    }
  }

  const onReset: FormProps['onReset'] = () => {
    form.submit()
  }

  const onCurrentChange: PaginationProps['onCurrentChange'] = current => {
    setCurrent(current)
    form.submit()
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
          queryBtn={queryBtn}
          resetBtn={resetBtn}
          {...search}
        />
      )}
      <Table
        data={tableProps.data ?? tableData}
        bordered={tableProps.bordered ?? true}
        tableLayout={tableProps.tableLayout ?? 'auto'}
        loading={tableProps.loading ?? tableLoading}
        columns={tableColumns}
        pagination={
          fetch ? { total, current, pageSize, onCurrentChange, onPageSizeChange } : pagination
        }
        {...tableProps}
      />
    </div>
  )
}
