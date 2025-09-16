import { AddIcon, EditIcon } from 'tdesign-icons-react'
import type { ResourceNode } from '@/global/api'
import { useForm } from '../hooks/use-form'

type Props = {
  mode?: 'add' | 'edit'
  rowData: ResourceNode
  refresh: () => void
}

export const UpsertBtn = (props: Props) => {
  const {
    t,
    mode,
    visible,
    form,
    initialData,
    rules,
    items,
    onOpen,
    onClose,
    onConfirm,
    confirmLoading
  } = useForm(props)

  return (
    <>
      {mode === 'edit' ? <EditIcon onClick={onOpen} /> : <AddIcon onClick={onOpen} />}
      <GlDialog
        header={t(
          mode === 'edit' ? 'resource.action.editResource' : 'resource.action.addResource',
          {
            ns: 'auth'
          }
        )}
        visible={visible}
        confirmLoading={confirmLoading}
        cancelBtn={{ content: t('action.cancel'), disabled: confirmLoading }}
        onClose={onClose}
        onConfirm={onConfirm}
      >
        <GlForm
          form={form}
          rules={rules}
          initialData={initialData}
          resetType='initial'
          items={items}
        />
      </GlDialog>
    </>
  )
}
