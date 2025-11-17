import type { GetAdminUserResponse } from '@/global/api'
import { postAdminUserList } from '@/global/api'
import { DeleteBtn } from './components/delete-btn'
import { MoreBtn } from './components/more-btn'
import { UpsertBtn } from './components/upsert-btn'

type SearchProps = Parameters<typeof GlSearch>[0]

export default () => {
  const { t } = useTranslation()
  const ref = useRef<GlTableRef>(null)

  const search = {
    items: [
      {
        formItem: {
          name: 'username',
          label: t('label.username')
        },
        component: <GlInput />
      },
      {
        formItem: {
          name: 'enabled',
          label: t('label.enabled')
        },
        component: <GlSelect options={getOptions('YES_NO')} />
      }
    ]
  } satisfies SearchProps

  const columns = [
    {
      colKey: 'username',
      title: t('label.username')
    },
    {
      colKey: 'enabled',
      title: t('label.enabled'),
      cellRenderType: 'boolean'
    },
    {
      colKey: 'isAdmin',
      title: t('label.isAdmin'),
      cellRenderType: 'boolean'
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
      colKey: 'operation',
      title: t('label.operation'),
      fixed: 'right',
      cell: ({ row }) => {
        return (
          <Space>
            <UpsertBtn mode='edit' rowData={row} refresh={refresh} />
            <DeleteBtn rowData={row} refresh={refresh} />
            <MoreBtn rowData={row} refresh={refresh} />
          </Space>
        )
      }
    }
  ] satisfies GlTalbeColumns<GetAdminUserResponse>

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
      api={postAdminUserList}
    />
  )
}
