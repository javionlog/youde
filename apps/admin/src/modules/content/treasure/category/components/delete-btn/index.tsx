import { DeleteIcon } from 'tdesign-icons-react'
import type { DeleteAdminTreasureCategoryData, TreasureCategoryNode } from '@/global/api'
import { deleteAdminResource } from '@/global/api'

interface Props {
  rowData: TreasureCategoryNode
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
      } satisfies DeleteAdminTreasureCategoryData['body']
      await deleteAdminResource({ body: params })

      MessagePlugin.success(t('message.operateSuccessful'))
      onClose()
      refresh()
    } finally {
      setConfirmLoading(false)
    }
  }

  return (
    <>
      <DeleteIcon onClick={onOpen} />
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
