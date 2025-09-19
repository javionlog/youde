import type { Role } from '@/global/api'
import { postAuthRbacRoleList } from '@/global/api'
import type { GlTableRef } from '@/global/components/gl-table'
import { DeleteBtn } from './components/delete-btn'
import { SetResourceBtn } from './components/set-resource-btn'
import { UpsertBtn } from './components/upsert-btn'

type SearchProps = Parameters<typeof GlSearch>[0]

export default () => {
  const { t } = useTranslation()
  const ref = useRef<GlTableRef>(null)

  const search = {
    items: [
      {
        formItem: {
          name: 'name',
          label: t('role.label.roleName', { ns: 'auth' })
        },
        component: <Input clearable />
      },
      {
        formItem: {
          name: 'enabled',
          label: t('label.enabled')
        },
        component: <Select options={getOptions('YES_NO')} clearable />
      }
    ]
  } satisfies SearchProps

  const columns = [
    {
      colKey: 'name',
      title: t('role.label.roleName', { ns: 'auth' })
    },
    {
      colKey: 'enabled',
      title: t('label.enabled'),
      cellRenderType: 'boolean'
    },
    {
      colKey: 'remark',
      title: t('label.remark')
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
        const rowData = row as Role
        return (
          <Space>
            <UpsertBtn mode='edit' rowData={rowData} refresh={refresh} />
            <DeleteBtn rowData={rowData} refresh={refresh} />
            <SetResourceBtn rowData={rowData} refresh={refresh} />
          </Space>
        )
      }
    }
  ] satisfies GlTalbeColumns

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
      api={postAuthRbacRoleList}
    />
  )
}
