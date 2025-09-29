import type { Role } from '@/global/api'
import { useTree } from './use-tree'

interface Props {
  rowData: Role
  refresh: () => void
}

export const SetResourceBtn = (props: Props) => {
  const { text, onOpen } = useTree(props)

  return (
    <div onClick={onOpen}>
      <Link hover='color' theme='primary'>
        {text}
      </Link>
    </div>
  )
}
