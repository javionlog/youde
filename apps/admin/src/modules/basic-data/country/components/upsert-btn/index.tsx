import type { GetAdminCountryResponse } from '@/global/api'
import { useForm } from './use-form'

interface Props {
  mode: 'add' | 'edit'
  rowData?: GetAdminCountryResponse
  refresh: () => void
}

export const UpsertBtn = (props: Props) => {
  const { t, mode, visible, form, rules, items, onOpen, onClose, onConfirm, confirmLoading } =
    useForm(props)
  const { checkResource } = useResourceStore()

  const text = mode === 'edit' ? t('action.edit') : t('action.add')
  return (
    checkResource('BasicData_Country_Edit') && (
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
          onClose={onClose}
          onConfirm={onConfirm}
        >
          <GlForm form={form} rules={rules} items={items} />
        </GlDialog>
      </>
    )
  )
}
