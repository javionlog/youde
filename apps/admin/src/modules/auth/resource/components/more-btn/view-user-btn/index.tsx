import type { ResourceNode } from '@/global/api'
import { postAdminUserResourceUserList } from '@/global/api'

interface Props {
  rowData: ResourceNode
}

export const ViewUserBtn = (props: Props) => {
  const { rowData } = props
  const { t } = useTranslation()

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
    }
  ] satisfies GlTalbeColumns<ResourceNode>

  const onOpen = () => {
    const dialogInstance = GlDialogPlugin({
      onClose: () => {
        dialogInstance.hide()
      },
      header: t('common.action.viewAssociatedUser', { ns: 'auth' }),
      footer: false,
      body: (
        <GlTable
          rowKey='id'
          columns={columns}
          maxHeight='100%'
          params={{ resourceId: rowData.id }}
          api={postAdminUserResourceUserList}
        />
      )
    })
  }

  return <div onClick={onOpen}>{t('common.action.viewAssociatedUser', { ns: 'auth' })}</div>
}
