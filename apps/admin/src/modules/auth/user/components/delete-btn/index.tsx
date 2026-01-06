import type { DeleteAdminUserData, GetAdminUserResponse } from '@/global/api'
import { deleteAdminUser } from '@/global/api'

interface Props {
  rowData: GetAdminUserResponse
  refresh: () => void
}

export const DeleteBtn = (props: Props) => {
  const { refresh, rowData } = props
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const { checkResource } = useResourceStore()

  const onOpen = () => {
    setVisible(true)
  }

  const onClose = () => {
    setVisible(false)
  }

  const onConfirm = async () => {
    try {
      setConfirmLoading(true)
      const params = {
        id: rowData.id
      } satisfies DeleteAdminUserData['body']
      await deleteAdminUser({ body: params })

      MessagePlugin.success(t('message.operateSuccessful'))
      onClose()
      refresh()
    } finally {
      setConfirmLoading(false)
    }
  }

  return (
    checkResource('Auth_User_Edit') && (
      <>
        <Link hover='color' theme='primary' onClick={onOpen}>
          {t('action.delete')}
        </Link>
        <GlDialog
          header={t('action.delete')}
          visible={visible}
          confirmLoading={confirmLoading}
          onClose={onClose}
          onConfirm={onConfirm}
        >
          {t('message.confirmDelete')}
        </GlDialog>
      </>
    )
  )
}
