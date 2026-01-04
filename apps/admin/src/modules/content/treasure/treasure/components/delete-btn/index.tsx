import type { DeleteAdminRoleData, GetAdminTreasureResponse } from '@/global/api'
import { deleteAdminRole } from '@/global/api'

interface Props {
  rowData: GetAdminTreasureResponse
  refresh: () => void
}

export const DeleteBtn = (props: Props) => {
  const { refresh, rowData } = props
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)

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
      } satisfies DeleteAdminRoleData['body']
      await deleteAdminRole({ body: params })

      MessagePlugin.success(t('message.operateSuccessful'))
      onClose()
      refresh()
    } finally {
      setConfirmLoading(false)
    }
  }

  return (
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
}
