import type { GetAdminTreasureResponse, PostAdminTreasureCategoryTreeResponse } from '@/global/api'
import { postAdminTreasureCategoryTree, postAdminTreasureList } from '@/global/api'
import { DeleteBtn } from './components/delete-btn'
import { UpsertBtn } from './components/upsert-btn'

type SearchProps = Parameters<typeof GlSearch>[0]

export const TreasurePanel = () => {
  const { t } = useTranslation()
  const lang = camelCase(useLocaleStore(state => state.lang))
  const [categoryOptions, setCategoryOptions] = useState<PostAdminTreasureCategoryTreeResponse>([])
  const ref = useRef<GlTableRef>(null)

  const finalCategoryOptions = useMemo(() => {
    const flatOptions = flattenTree(categoryOptions).map(item => {
      const categoryLocale = item.locales?.find(o => o.field === 'name')
      const categoryName = categoryLocale?.[lang as 'enUs'] ?? item.name
      return {
        ...item,
        name: categoryName
      }
    })
    return buildTree(flatOptions)
  }, [categoryOptions, lang])

  const search = {
    items: [
      {
        formItem: {
          name: 'categoryIds',
          label: t('treasure.label.category', { ns: 'content' }),
          children: (
            <GlCascader
              keys={{ label: 'name', value: 'id', children: 'children' }}
              options={finalCategoryOptions}
              multiple
            />
          )
        }
      },
      {
        formItem: {
          name: 'title',
          label: t('label.title'),
          children: <GlInput />
        }
      }
    ]
  } satisfies SearchProps

  const columns = [
    {
      colKey: 'categoryId',
      title: t('treasure.label.category', { ns: 'content' })
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
      title: t('label.country')
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

  useEffect(() => {
    postAdminTreasureCategoryTree({ body: {} }).then(res => {
      setCategoryOptions(res.data ?? [])
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
      api={postAdminTreasureList}
      className='mt-4'
    />
  )
}
