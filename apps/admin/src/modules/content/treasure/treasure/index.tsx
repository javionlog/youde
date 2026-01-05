import type { GetAdminTreasureResponse } from '@/global/api'
import { postAdminTreasureList } from '@/global/api'
import { DeleteBtn } from './components/delete-btn'
import { UpsertBtn } from './components/upsert-btn'

type SearchProps = Parameters<typeof GlSearch>[0]

export const TreasurePanel = () => {
  const { t } = useTranslation()
  const ref = useRef<GlTableRef>(null)

  const search = {
    items: [
      {
        formItem: {
          name: 'categoryIds',
          label: t('treasure.label.category', { ns: 'content' }),
          children: <GlCascader options={useTreasureStore().getCategoryTree()} multiple />
        }
      },
      {
        formItem: {
          name: 'title',
          label: t('label.title'),
          children: <GlInput />
        }
      },
      {
        formItem: {
          name: 'fees',
          label: t('label.fee'),
          children: <GlSelect options={getOptions('TREASURE_FEE')} multiple />
        }
      },
      {
        formItem: {
          name: 'countryCodes',
          label: t('label.country'),
          children: <GlCascader options={useBasicDataStore().getRegionCountryTree()} multiple />
        }
      },
      {
        formItem: {
          name: 'status',
          label: t('label.status'),
          children: <GlSelect options={getOptions('TREASURE_STATUS')} multiple />
        }
      }
    ]
  } satisfies SearchProps

  const columns = [
    {
      colKey: 'categoryId',
      title: t('treasure.label.category', { ns: 'content' }),
      cell: ({ row }) => {
        return useTreasureStore.getState().getCategoryName(row.categoryId)
      }
    },
    {
      colKey: 'title',
      title: t('label.title')
    },
    {
      colKey: 'description',
      title: t('label.description')
    },
    {
      colKey: 'fee',
      title: t('label.fee'),
      cellRenderType: 'enum',
      enumKey: 'TREASURE_FEE'
    },
    {
      colKey: 'countryCode',
      title: t('label.country'),
      cell: ({ row }) => {
        return useBasicDataStore.getState().getCountryName(row.countryCode)
      }
    },
    {
      colKey: 'url',
      title: t('label.url')
    },
    {
      colKey: 'status',
      title: t('label.status'),
      cellRenderType: 'enum',
      enumKey: 'TREASURE_STATUS'
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
  ] satisfies GlTalbeColumns<GetAdminTreasureResponse>

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
      api={postAdminTreasureList}
      className='mt-4'
    />
  )
}
