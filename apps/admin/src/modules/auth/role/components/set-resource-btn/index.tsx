import type { Role } from '@/global/api'
import { useTree } from './use-tree'

type Props = {
  rowData: Role
  refresh: () => void
}

export const SetResourceBtn = (props: Props) => {
  const {
    t,
    visible,
    resourceTree,
    resourceValue,
    loading,
    confirmLoading,
    ref,
    getLabel,
    onChange,
    onOpen,
    onOpened,
    onClose,
    onConfirm
  } = useTree(props)

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
        <Loading loading={loading}>
          <Tree
            ref={ref}
            value={resourceValue}
            data={resourceTree}
            keys={{ value: 'id', children: 'children' }}
            label={getLabel}
            checkable
            onChange={onChange}
          />
        </Loading>
      </GlDialog>
    </>
  )
}
