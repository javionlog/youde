import type { TreasureCategoryNode } from '@/global/api'
import { useForm } from './use-form'

interface Props {
  rowData: TreasureCategoryNode
  refresh: () => void
}

export const SetLocaleBtn = (props: Props) => {
  const { text, onOpen } = useForm(props)

  return <div onClick={onOpen}>{text}</div>
}
