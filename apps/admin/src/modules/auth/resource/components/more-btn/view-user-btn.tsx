import type { ResourceNode } from '@/global/api'
import { postAuthRbacListResourceUsers } from '@/global/api'

type Props = {
  rowData: ResourceNode
}

export const ViewUserBtn = (props: Props) => {
  const { rowData } = props
  const { t } = useTranslation()
  const columns = [
    {
      colKey: 'id',
      title: 'ID'
    },
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
    }
  ] satisfies TalbeColumns

  const { run: onOpen } = useThrottleFn(
    () => {
      const dialogInstance = GlDialogPlugin({
        onClose: () => {
          dialogInstance.hide()
        },
        header: t('resource.action.viewAssociatedUser', { ns: 'auth' }),
        footer: false,
        body: (
          <GlTable
            rowKey='id'
            columns={columns}
            maxHeight='100%'
            params={{ resourceId: rowData.id }}
            fetch={postAuthRbacListResourceUsers}
          />
        )
      })
    },
    { wait: 500 }
  )

  return <div onClick={onOpen}>{t('resource.action.viewAssociatedUser', { ns: 'auth' })}</div>
}
