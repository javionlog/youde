import type { User } from '@/global/api'
import { postAuthRbacUserList } from '@/global/api'
import { AddBtn } from './components/add-btn'
import { DeleteBtn } from './components/delete-btn'
import { MoreBtn } from './components/more-btn'

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
        return (
          <Space>
            <DeleteBtn rowData={row} refresh={refresh} />
            <MoreBtn rowData={row} refresh={refresh} />
          </Space>
        )
      }
    }
  ] satisfies GlTalbeColumns<User>

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
          <AddBtn refresh={refresh} />
        </Space>
      }
      columns={columns}
      api={postAuthRbacUserList}
    />
  )
}
