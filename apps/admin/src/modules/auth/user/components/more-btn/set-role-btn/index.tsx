import type { GetAdminUserResponse } from '@/global/api'
import { useTable } from './use-table'

interface Props {
  rowData: GetAdminUserResponse
}

export const SetRoleBtn = (props: Props) => {
  const { text, onOpen } = useTable(props)

  return (
    <div onClick={onOpen}>
      <Link hover='color' theme='primary'>
        {text}
      </Link>
    </div>
  )
}
