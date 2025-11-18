import type { GetAdminUserResponse } from '@/global/api'
import { useForm } from './use-form'

interface Props {
  rowData: GetAdminUserResponse
}

export const ResetPasswordBtn = (props: Props) => {
  const { text, onOpen } = useForm(props)

  return (
    <div onClick={onOpen}>
      <Link hover='color' theme='primary'>
        {text}
      </Link>
    </div>
  )
}
