import type { GetAdminRoleResponse } from '@/global/api'
import { useTree } from './use-tree'

interface Props {
  rowData: GetAdminRoleResponse
  refresh: () => void
}

export const SetResourceBtn = (props: Props) => {
  const { text, onOpen } = useTree(props)
  const { checkResource } = useResourceStore()

  return (
    checkResource('Auth_Role_Edit') && (
      <button onClick={onOpen}>
        <Link hover='color' theme='primary'>
          {text}
        </Link>
      </button>
    )
  )
}
