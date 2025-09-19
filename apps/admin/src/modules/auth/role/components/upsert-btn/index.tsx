import type { Role } from '@/global/api'
import { useForm } from '../../hooks/use-form'

type Props = {
  mode: 'add' | 'edit'
  rowData?: Role
  refresh: () => void
}

export const UpsertBtn = (props: Props) => {
  const { t, mode, visible, form, rules, items, onOpen, onClose, onConfirm, confirmLoading } =
    useForm(props)

  const text = mode === 'edit' ? t('action.edit') : t('action.add')
  return (
    <>
      {mode === 'edit' ? (
        <Link hover='color' theme='primary' onClick={onOpen}>
          {text}
        </Link>
      ) : (
        <Button onClick={onOpen}>{text}</Button>
      )}
      <GlDialog
        header={text}
        visible={visible}
        confirmLoading={confirmLoading}
        cancelBtn={{ content: t('action.cancel'), disabled: confirmLoading }}
        onClose={onClose}
        onConfirm={onConfirm}
      >
        <GlForm form={form} rules={rules} items={items} />
      </GlDialog>
    </>
  )
}
