import { AddIcon, EditIcon } from 'tdesign-icons-react'
import type { ResourceNode } from '@/global/api'
import { useForm } from './use-form'

type Props = {
  mode?: 'add' | 'edit'
  rowData?: ResourceNode
  refresh: () => void
}

export const UpsertBtn = (props: Props) => {
  const { t, mode, visible, form, rules, items, onOpen, onClose, onConfirm, confirmLoading } =
    useForm(props)

  return (
    <>
      {mode === 'edit' ? (
        <EditIcon onClick={onOpen} />
      ) : mode === 'add' ? (
        <AddIcon onClick={onOpen} />
      ) : (
        <Button onClick={onOpen}>{t('action.add')}</Button>
      )}
      <GlDialog
        header={t(mode === 'edit' ? 'action.edit' : 'action.add')}
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
