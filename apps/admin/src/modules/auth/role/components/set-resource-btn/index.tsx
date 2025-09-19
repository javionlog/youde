import type { Role } from '@/global/api'
import { useTable } from './use-table'

type Props = {
  rowData?: Role
  refresh: () => void
}

export const SetResourceBtn = (props: Props) => {
  const {
    t,
    ref,
    visible,
    search,
    columns,
    params,
    api,
    onOpen,
    onOpened,
    onClose,
    onConfirm,
    confirmLoading
  } = useTable(props)

  const text = t('common.action.setResource', { ns: 'auth' })
  return (
    <>
      <Link hover='color' theme='primary' onClick={onOpen}>
        {text}
      </Link>
      <GlDialog
        header={text}
        visible={visible}
        confirmLoading={confirmLoading}
        cancelBtn={{ content: t('action.cancel'), disabled: confirmLoading }}
        onOpened={onOpened}
        onClose={onClose}
        onConfirm={onConfirm}
      >
        <GlTable
          ref={ref}
          rowKey='id'
          search={search}
          columns={columns}
          params={params}
          api={api}
        />
      </GlDialog>
    </>
  )
}
