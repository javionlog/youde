import type { GetAdminCountryResponse, PostAdminCountryListData } from '@/global/api'
import { postAdminCountryList } from '@/global/api'
import { DeleteBtn } from './components/delete-btn'
import { UpsertBtn } from './components/upsert-btn'

type SearchProps = Parameters<typeof GlSearch>[0]

export default () => {
  const { t } = useTranslation()
  const ref = useRef<GlTableRef>(null)

  const search = {
    items: [
      {
        formItem: {
          name: 'regions',
          label: t('label.region'),
          children: (
            <GlSelect
              multiple
              options={useBasicDataStore().getRegionOptions()}
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
          name: '_codes',
          shouldUpdate: (
            prev: PostAdminCountryListData['body'],
            cur: PostAdminCountryListData['body']
          ) => {
            return prev.regions?.length !== cur.regions?.length
          },
          children: ({ getFieldValue }) => {
            const regions = getFieldValue('regions') as string[]
            const options = useBasicDataStore().getCountryOptions(regions, {
              label: 'code',
              value: 'code'
            })
            return (
              <GlFormItem name='codes' label={t('label.code')}>
                <GlSelect multiple options={options} />
              </GlFormItem>
            )
          }
        }
      },
      {
        formItem: {
          name: '_enUs',
          shouldUpdate: (
            prev: PostAdminCountryListData['body'],
            cur: PostAdminCountryListData['body']
          ) => {
            return prev.regions?.length !== cur.regions?.length
          },
          children: ({ getFieldValue }) => {
            const regions = getFieldValue('regions') as string[]
            const options = useBasicDataStore().getCountryOptions(regions, {
              label: 'enUs',
              value: 'enUs'
            })
            return (
              <GlFormItem name='enUs' label={t('label.english')}>
                <GlSelect multiple options={options} />
              </GlFormItem>
            )
          }
        }
      },
      {
        formItem: {
          name: '_zhCn',
          shouldUpdate: (
            prev: PostAdminCountryListData['body'],
            cur: PostAdminCountryListData['body']
          ) => {
            return prev.regions?.length !== cur.regions?.length
          },
          children: ({ getFieldValue }) => {
            const regions = getFieldValue('regions') as string[]
            const options = useBasicDataStore().getCountryOptions(regions, {
              label: 'zhCn',
              value: 'zhCn'
            })
            return (
              <GlFormItem name='zhCn' label={t('label.simplifiedChinese')}>
                <GlSelect multiple options={options} />
              </GlFormItem>
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
