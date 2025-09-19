import type { PostAuthRbacRoleDeleteData, Role } from '@/global/api'
import { postAuthRbacRoleDelete } from '@/global/api'

type Props = {
  rowData: Role
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
      } as PostAuthRbacRoleDeleteData['body']
      await postAuthRbacRoleDelete({ body: params })

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
        cancelBtn={{ content: t('action.cancel'), disabled: confirmLoading }}
        onClose={onClose}
        onConfirm={onConfirm}
      >
        {t('message.confirmDelete')}
      </GlDialog>
    </>
  )
}
