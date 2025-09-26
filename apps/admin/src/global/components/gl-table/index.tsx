import type { ReactNode, RefObject } from 'react'
import type {
  FormProps,
  InternalFormInstance,
  PaginationProps,
  PrimaryTableRef,
  TableProps,
  TableRowData
} from 'tdesign-react'

type SearchProps = Parameters<typeof GlSearch>[0]
type FetchResponseData = {
  data: {
    records: any[]
    total: number
  }
}

export type GlTableRef = PrimaryTableRef & {
  fetch: () => void
  form: InternalFormInstance
}

interface Props<T extends TableRowData> extends StyledProps, TableProps<T> {
  search?: SearchProps
  params?: Record<PropertyKey, any>
  api?: (...args: any[]) => Promise<any>
  operation?: ReactNode
  ref?: RefObject<GlTableRef | null>
}

export const GlTable = <T extends TableRowData>(props: Props<T>) => {
  const {
    className,
    style,
    search,
    params,
    api,
    operation,
    pagination,
    columns,
    ref,
    ...tableProps
  } = props

  const { t } = useTranslation()
  const [form] = Form.useForm()
  const [tableData, setTableData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)
  const [current, setCurrent, getCurrent] = useGetState(1)
  const [pageSize, setPageSize, getPageSize] = useGetState(10)
  const tableWrapRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<PrimaryTableRef>(null)

  const { height } = useAutoHeight(tableWrapRef.current, {
    afterTarget: tableWrapRef.current?.querySelector('.t-table__pagination-wrap'),
    afterHeight: 40
  })

  const fetch = async () => {
    if (api) {
      if (search) {
        form.submit()
      } else {
        try {
          const finalParams = {
            ...params,
            page: getCurrent(),
            pageSize: getPageSize()
          }
          setLoading(true)
          const { records, total } = await api({ body: finalParams }).then(
            (r: FetchResponseData) => r.data
          )
          setTableData(records)
          setTotal(total)
        } finally {
          setLoading(false)
        }
      }
    }
  }

  useEffect(() => {
    fetch()
  }, [])

  useImperativeHandle(ref, () => {
    return {
      ...tableRef.current!,
      fetch,
      form
    }
  })

  const tableColumns = (columns as GlTalbeColumns<T>)?.map(item => {
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
          return formatDate(row[col.colKey!])
        }

        return row[col.colKey!]
      },
      ...item
    } satisfies typeof item
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
      if (api) {
        try {
          const finalParams = {
            ...params,
            ...form.getFieldsValue(true),
            page: getCurrent(),
            pageSize: getPageSize()
          }
          setLoading(true)
          const { records, total } = await api({ body: finalParams }).then(
            (r: FetchResponseData) => r.data
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

  const onCurrentChange: PaginationProps['onCurrentChange'] = async current => {
    setCurrent(current)
    await Promise.resolve()
    fetch()
  }

  const onPageSizeChange: PaginationProps['onPageSizeChange'] = async pageSize => {
    setPageSize(pageSize)
    await Promise.resolve()
    fetch()
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
      <div ref={tableWrapRef}>
        <Table
          ref={tableRef}
          data={tableProps.data ?? tableData}
          bordered={tableProps.bordered ?? true}
          tableLayout={tableProps.tableLayout ?? 'auto'}
          loading={tableProps.loading ?? loading}
          maxHeight={tableProps.maxHeight ?? height}
          columns={tableColumns}
          pagination={
            api
              ? {
                  total,
                  current,
                  pageSize,
                  onCurrentChange,
                  onPageSizeChange,
                  disabled: loading
                }
              : pagination
          }
          {...tableProps}
        />
      </div>
    </div>
  )
}
