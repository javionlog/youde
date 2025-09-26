import type { User } from '@/global/api'
import { useTree } from './use-tree'

interface Props {
  rowData: User
}

export const ViewResourceBtn = (props: Props) => {
  const { text, onOpen } = useTree(props)

  return (
    <div>
      <Link hover='color' theme='primary' onClick={onOpen}>
        {text}
      </Link>
    </div>
  )
}
