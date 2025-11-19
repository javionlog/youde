import type { GetAdminSessionResponse } from '@/global/api'
import { postAdminSessionList } from '@/global/api'
import { DeleteBtn } from './components/delete-btn'

type SearchProps = Parameters<typeof GlSearch>[0]

export default () => {
  const { t } = useTranslation()
  const ref = useRef<GlTableRef>(null)

  const search = {
    items: [
      {
        formItem: {
          name: 'username',
          label: t('label.username'),
          children: <GlInput />
        }
      }
    ]
  } satisfies SearchProps

  const columns = [
    {
      colKey: 'username',
      title: t('label.username')
    },
    {
      colKey: 'token',
      title: t('label.token')
    },
    {
      colKey: 'ipAddress',
      title: t('label.ipAddress')
    },
    {
      colKey: 'userAgent',
      title: t('label.userAgent')
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
            <DeleteBtn rowData={row} refresh={refresh} />
          </Space>
        )
      }
    }
  ] satisfies GlTalbeColumns<GetAdminSessionResponse>

  const refresh = () => {
    ref.current?.fetch()
  }

  return (
    <GlTable ref={ref} rowKey='id' search={search} columns={columns} api={postAdminSessionList} />
  )
}
