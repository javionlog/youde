import { useForm } from './use-form'

interface Props {
  refresh: () => void
}

export const AddBtn = (props: Props) => {
  const { t, visible, form, rules, items, onOpen, onClose, onConfirm, confirmLoading } =
    useForm(props)

  return (
    <>
      <Button onClick={onOpen}>{t('action.add')}</Button>
      <GlDialog
        header={t('action.add')}
        visible={visible}
        confirmLoading={confirmLoading}
        onClose={onClose}
        onConfirm={onConfirm}
      >
        <GlForm form={form} rules={rules} items={items} />
      </GlDialog>
    </>
  )
}
