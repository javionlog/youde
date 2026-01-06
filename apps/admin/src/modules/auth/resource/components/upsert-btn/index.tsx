import { AddIcon, EditIcon } from 'tdesign-icons-react'
import type { ResourceNode } from '@/global/api'
import { useForm } from './use-form'

interface Props {
  mode?: 'add' | 'edit'
  rowData?: ResourceNode
  refresh: () => void
}

export const UpsertBtn = (props: Props) => {
  const { t, mode, visible, form, rules, items, onOpen, onClose, onConfirm, confirmLoading } =
    useForm(props)
  const { checkResource } = useResourceStore()

  return (
    checkResource('Auth_Resource_Edit') && (
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
          onClose={onClose}
          onConfirm={onConfirm}
        >
          <GlForm form={form} rules={rules} items={items} />
        </GlDialog>
      </>
    )
  )
}
