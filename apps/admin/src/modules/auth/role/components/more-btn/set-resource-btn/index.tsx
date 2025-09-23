import type { Role } from '@/global/api'
import { useTree } from './use-tree'

type Props = {
  rowData: Role
  refresh: () => void
}

export const SetResourceBtn = (props: Props) => {
  const { text, onOpen } = useTree(props)

  return (
    <div>
      <Link hover='color' theme='primary' onClick={onOpen}>
        {text}
      </Link>
    </div>
  )
}
