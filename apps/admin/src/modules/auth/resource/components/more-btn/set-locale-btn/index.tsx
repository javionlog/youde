import type { ResourceNode } from '@/global/api'
import { useForm } from './use-form'

interface Props {
  rowData: ResourceNode
  refresh: () => void
}

export const SetLocaleBtn = (props: Props) => {
  const { text, onOpen } = useForm(props)
  const { checkResource } = useResourceStore()

  return checkResource('Auth_Resource_Edit') && <div onClick={onOpen}>{text}</div>
}
