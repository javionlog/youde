import type { GetAdminUserResponse } from '@/global/api'
import { useTree } from './use-tree'

interface Props {
  rowData: GetAdminUserResponse
}

export const ViewResourceBtn = (props: Props) => {
  const { text, onOpen } = useTree(props)

  return (
    <div onClick={onOpen}>
      <Link hover='color' theme='primary'>
        {text}
      </Link>
    </div>
  )
}
