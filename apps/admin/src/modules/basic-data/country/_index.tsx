import type { GetAdminCountryResponse, PostAdminCountryListResponse } from '@/global/api'
import { postAdminCountryList } from '@/global/api'
import { DeleteBtn } from './components/delete-btn'
import { UpsertBtn } from './components/upsert-btn'

type SearchProps = Parameters<typeof GlSearch>[0]

export default () => {
  const { t } = useTranslation()
  const ref = useRef<GlTableRef>(null)
  const [countries, setCountries] = useState<PostAdminCountryListResponse['records']>([])

  const search = {
    items: [
      {
        formItem: {
          name: 'regions',
          label: t('label.region')
        },
        component: (
          <GlSelect
            multiple
            options={uniqBy(
              countries
                .map(item => {
                  return {
                    label: item.region,
                    value: item.region
                  }
                })
                .sort((a, b) => a.value.localeCompare(b.value)),
              item => item.value
            )}
          />
        )
      },
      {
        formItem: {
          name: 'codes',
          label: t('label.code')
        },
        component: (
          <GlSelect
            multiple
            options={countries
              .map(item => {
                return {
                  label: item.code,
                  value: item.code
                }
              })
              .sort((a, b) => a.value.localeCompare(b.value))}
          />
        )
      }
    ]
  } satisfies SearchProps

  const columns = [
    {
      colKey: 'region',
      title: t('label.region')
    },
    {
      colKey: 'code',
      title: t('label.code')
    },
    {
      colKey: 'enUs',
      title: t('label.english')
    },
    {
      colKey: 'zhCn',
      title: t('label.simplifiedChinese')
    },
    {
      colKey: 'createdAt',
      title: t('label.createdAt'),
      cellRenderType: 'datetime'
    },
    {
      colKey: 'updatedAt',
      title: t('label.updatedAt'),
      cellRenderType: 'datetime'
    },
    {
      colKey: 'createdBy',
      title: t('label.createdBy')
    },
    {
      colKey: 'updatedBy',
      title: t('label.updatedBy')
    },
    {
      colKey: 'operation',
      title: t('label.operation'),
      fixed: 'right',
      cell: ({ row }) => {
        return (
          <Space>
            <UpsertBtn mode='edit' rowData={row} refresh={refresh} />
            <DeleteBtn rowData={row} refresh={refresh} />
          </Space>
        )
      }
    }
  ] satisfies GlTalbeColumns<GetAdminCountryResponse>

  const refresh = () => {
    ref.current?.fetch()
  }

  useEffect(() => {
    postAdminCountryList({ body: {} }).then(res => {
      setCountries(res.data?.records ?? [])
    })
  }, [])

  return (
    <GlTable
      ref={ref}
      rowKey='id'
      search={search}
      operation={
        <Space>
          <UpsertBtn mode='add' refresh={refresh} />
        </Space>
      }
      columns={columns}
      api={postAdminCountryList}
    />
  )
}
