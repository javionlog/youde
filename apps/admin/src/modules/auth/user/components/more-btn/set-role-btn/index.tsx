import type { GetAdminUserResponse } from '@/global/api'
import { useTable } from './use-table'

interface Props {
  rowData: GetAdminUserResponse
}

export const SetRoleBtn = (props: Props) => {
  const { text, onOpen } = useTable(props)
  const { checkResource } = useResourceStore()

  return (
    checkResource('Auth_User_Edit') && (
      <div onClick={onOpen}>
        <Link hover='color' theme='primary'>
          {text}
        </Link>
      </div>
    )
  )
}
