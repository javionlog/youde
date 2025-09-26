import type { User } from '@/global/api'
import { useTable } from './user-table'

interface Props {
  rowData: User
}

export const SetRoleBtn = (props: Props) => {
  const { text, onOpen } = useTable(props)

  return (
    <div>
      <Link hover='color' theme='primary' onClick={onOpen}>
        {text}
      </Link>
    </div>
  )
}
