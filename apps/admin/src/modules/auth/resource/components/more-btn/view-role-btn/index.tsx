import type { ResourceNode } from '@/global/api'
import { postAuthRbacListResourceRoles } from '@/global/api'

interface Props {
  rowData: ResourceNode
}

export const ViewRoleBtn = (props: Props) => {
  const { rowData } = props
  const { t } = useTranslation()

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
    }
  ] satisfies GlTalbeColumns<ResourceNode>

  const onOpen = () => {
    const dialogInstance = GlDialogPlugin({
      onClose: () => {
        dialogInstance.hide()
      },
      header: t('common.action.viewAssociatedRole', { ns: 'auth' }),
      footer: false,
      body: (
        <GlTable
          rowKey='id'
          columns={columns}
          maxHeight='100%'
          params={{ resourceId: rowData.id }}
          api={postAuthRbacListResourceRoles}
        />
      )
    })
  }

  return <div onClick={onOpen}>{t('common.action.viewAssociatedRole', { ns: 'auth' })}</div>
}
