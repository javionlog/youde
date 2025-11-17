import type { GetAdminRoleResponse } from '@/global/api'
import { postAdminUserRoleUserList } from '@/global/api'

interface Props {
  rowData: GetAdminRoleResponse
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
  ] satisfies GlTalbeColumns<GetAdminRoleResponse>

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
          params={{ roleId: rowData.id }}
          api={postAdminUserRoleUserList}
        />
      )
    })
  }

  return (
    <div onClick={onOpen}>
      <Link hover='color' theme='primary'>
        {t('common.action.viewAssociatedUser', { ns: 'auth' })}
      </Link>
    </div>
  )
}
