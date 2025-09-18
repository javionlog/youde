import type { ReactNode, RefObject } from 'react'
import { useImperativeHandle } from 'react'
import type { FormProps, PaginationProps, PrimaryTableRef, TableProps } from 'tdesign-react'

type SearchProps = Parameters<typeof GlSearch>[0]
type FetchResponseData = {
  data: {
    records: any[]
    total: number
  }
}

export type GlTableRef = PrimaryTableRef & {
  fetch: () => void
}

interface Props extends StyledProps, TableProps {
  search?: SearchProps
  params?: Record<PropertyKey, any>
  api?: (...args: any[]) => Promise<any>
  operation?: ReactNode
  ref?: RefObject<GlTableRef | null>
}

export const GlTable = (props: Props) => {
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

  const fetch = () => {
    if (api) {
      if (search) {
        form.submit()
      } else {
        const finalParams = {
          ...params,
          page: getCurrent(),
          pageSize: getPageSize()
        }
        setLoading(true)
        api({ body: finalParams })
          .then((r: FetchResponseData) => {
            const { records, total } = r.data
            setTableData(records)
            setTotal(total)
          })
          .finally(() => {
            setLoading(false)
          })
      }
    }
  }

  useEffect(() => {
    fetch()
  }, [])

  useImperativeHandle(ref, () => {
    return {
      ...tableRef.current!,
      fetch
    }
  })

  const tableColumns = (columns as GlTalbeColumns)?.map(item => {
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
    } satisfies GlTalbeColumns[number] & GlTableExtendColumn
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
      const finalParams = {
        ...params,
        ...form.getFieldsValue(true),
        page: getCurrent(),
        pageSize: getPageSize()
      }
      if (api) {
        setLoading(true)
        try {
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

  const onCurrentChange: PaginationProps['onCurrentChange'] = current => {
    setCurrent(current)
    Promise.resolve().then(() => {
      fetch()
    })
  }

  const onPageSizeChange: PaginationProps['onPageSizeChange'] = pageSize => {
    setPageSize(pageSize)
    Promise.resolve().then(() => {
      fetch()
    })
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
