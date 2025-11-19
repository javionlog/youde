import FormItem from 'tdesign-react/es/form/FormItem'
import type {
  GetAdminCountryResponse,
  PostAdminCountryListData,
  PostAdminCountryListResponse
} from '@/global/api'
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
          label: t('label.region'),
          children: (
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
              onChange={async () => {
                await Promise.resolve()
                ref.current?.form.setFieldsValue({ codes: [], enUs: [], zhCn: [] })
              }}
            />
          )
        }
      },
      {
        formItem: {
          name: 'codes',
          shouldUpdate: (prev, cur) => {
            return prev.regions?.length !== cur.regions?.length
          },
          children: ({ getFieldValue }) => {
            const regions = getFieldValue('regions') as string[]
            const options = countries
              .filter(item => {
                return regions?.length ? regions.includes(item.region) : true
              })
              .map(item => {
                return {
                  label: item.code,
                  value: item.code
                }
              })
              .sort((a, b) => a.value.localeCompare(b.value))
            return (
              <FormItem name='codes' label={t('label.code')}>
                <GlSelect multiple options={options} />
              </FormItem>
            )
          }
        }
      },
      {
        formItem: {
          name: 'enUs',
          shouldUpdate: (prev, cur) => {
            return prev.regions?.length !== cur.regions?.length
          },
          children: ({ getFieldValue }) => {
            const regions = getFieldValue('regions') as string[]
            const options = countries
              .filter(item => {
                return regions?.length ? regions.includes(item.region) : true
              })
              .map(item => {
                return {
                  label: item.enUs,
                  value: item.enUs
                }
              })
              .sort((a, b) => a.value.localeCompare(b.value))
            return (
              <FormItem key='enUs' name='enUs' label={t('label.english')}>
                <GlSelect multiple options={options} />
              </FormItem>
            )
          }
        }
      },
      {
        formItem: {
          name: 'zhCn',
          shouldUpdate: (
            prev: PostAdminCountryListData['body'],
            cur: PostAdminCountryListData['body']
          ) => {
            return prev.regions?.length !== cur.regions?.length
          },
          children: ({ getFieldValue }) => {
            const regions = getFieldValue('regions') as string[]
            const options = countries
              .filter(item => {
                return regions?.length ? regions.includes(item.region) : true
              })
              .map(item => {
                return {
                  label: item.zhCn,
                  value: item.zhCn
                }
              })
              .sort((a, b) => a.value.localeCompare(b.value))
            return (
              <FormItem key='zhCn' name='zhCn' label={t('label.simplifiedChinese')}>
                <GlSelect multiple options={options} />
              </FormItem>
            )
          }
        }
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
