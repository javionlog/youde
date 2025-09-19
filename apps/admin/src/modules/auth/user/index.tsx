import type { User } from '@/global/api'
import { postAuthRbacUserList } from '@/global/api'
import type { GlTableRef } from '@/global/components/gl-table'
import { AddBtn } from './components/add-btn'
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
          label: t('label.username')
        },
        component: <Input clearable />
      },
      {
        formItem: {
          name: 'displayUsername',
          label: t('label.displayUsername')
        },
        component: <Input clearable />
      },
      {
        formItem: {
          name: 'email',
          label: t('label.email')
        },
        component: <Input clearable />
      }
    ]
  } satisfies SearchProps

  const columns = [
    {
      colKey: 'name',
      title: t('label.name')
    },
    {
      colKey: 'username',
      title: t('label.username')
    },
    {
      colKey: 'displayUsername',
      title: t('label.displayUsername')
    },
    {
      colKey: 'email',
      title: t('label.email')
    },
    {
      colKey: 'emailVerified',
      title: t('label.emailVerified'),
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
        const rowData = row as User
        return (
          <Space>
            <DeleteBtn rowData={rowData} refresh={getList} />
          </Space>
        )
      }
    }
  ] satisfies GlTalbeColumns

  const getList = () => {
    ref.current?.fetch()
  }

  return (
    <GlTable
      ref={ref}
      rowKey='id'
      search={search}
      operation={
        <Space>
          <AddBtn refresh={getList} />
        </Space>
      }
      columns={columns}
      api={postAuthRbacUserList}
    />
  )
}
