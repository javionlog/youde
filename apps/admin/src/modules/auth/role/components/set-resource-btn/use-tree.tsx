import type { TreeInstanceFunctions, TreeNodeValue, TreeProps } from 'tdesign-react'
import type { PostAuthRbacRoleResourceRelationBatchSetData, ResourceNode, Role } from '@/global/api'
import {
  postAuthRbacListResourceTree,
  postAuthRbacRoleResourceRelationBatchSet,
  postAuthRbacRoleResourceRelationList
} from '@/global/api'

type Props = {
  rowData: Role
  refresh: () => void
}

export const useTree = (props: Props) => {
  const { rowData, refresh } = props

  const lang = camelCase(useLocaleStore(state => state.lang))
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const [resourceTree, setResourceTree] = useState<ResourceNode[]>([])
  const [resourceValue, setResourceValue] = useState<TreeNodeValue[]>([])
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const ref = useRef<TreeInstanceFunctions>(null)

  const getLabel: TreeProps['label'] = node => {
    type NodeData = typeof node.data & ResourceNode
    const nodeData = node.data as NodeData
    const menuLocale = nodeData.locales?.find(o => o.field === 'name')
    const menuName = menuLocale?.[lang as 'enUs'] ?? nodeData.name
    return <GlEllipsis>{menuName}</GlEllipsis>
  }

  const onChange: TreeProps['onChange'] = (value: TreeNodeValue[]) => {
    setResourceValue(value)
  }

  const onOpen = () => {
    setVisible(true)
  }

  const onOpened = async () => {
    setLoading(true)
    try {
      setResourceValue([])
      const treeList = await postAuthRbacListResourceTree({ body: { enabled: true } }).then(
        r => r.data ?? []
      )
      setResourceTree(treeList)
      const relationList = await postAuthRbacRoleResourceRelationList({
        body: { roleId: rowData.id }
      }).then(r => r.data?.records ?? [])
      setResourceValue(relationList.map(o => o.resourceId))
    } finally {
      setLoading(false)
    }
  }

  const onClose = () => {
    setVisible(false)
  }

  const onConfirm = async () => {
    try {
      setConfirmLoading(true)
      const params = {
        roleId: rowData.id,
        resourceIds: resourceValue
      } satisfies PostAuthRbacRoleResourceRelationBatchSetData['body']
      await postAuthRbacRoleResourceRelationBatchSet({ body: params })
      MessagePlugin.success(t('message.operateSuccessful'))
      onClose()
      refresh()
    } finally {
      setConfirmLoading(false)
    }
  }

  return {
    t,
    visible,
    resourceTree,
    resourceValue,
    loading,
    confirmLoading,
    ref,
    getLabel,
    onChange,
    onOpen,
    onOpened,
    onClose,
    onConfirm
  }
}
