import type { TreeProps } from 'tdesign-react'
import type { ResourceNode, Role } from '@/global/api'
import { postAuthRbacListRoleResourceTree } from '@/global/api'

interface Props {
  rowData: Role
}

interface DialogBodyProps {
  rowData: Role
}

const DialogBody = (props: DialogBodyProps) => {
  const { rowData } = props

  const lang = camelCase(useLocaleStore(state => state.lang))
  const [resourceTree, setResourceTree] = useState<ResourceNode[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true)
        const treeList = await postAuthRbacListRoleResourceTree({
          body: { roleId: rowData.id }
        }).then(r => r.data ?? [])
        setResourceTree(treeList)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const getLabel: TreeProps['label'] = node => {
    type NodeData = typeof node.data & ResourceNode
    const nodeData = node.data as NodeData
    const menuLocale = nodeData.locales?.find(o => o.field === 'name')
    const menuName = menuLocale?.[lang as 'enUs'] ?? nodeData.name
    return (
      <GlEllipsis>
        <span className=' mr-1 text-(--td-brand-color)'>
          [{getTranslate('RESOURCE_TYPE', nodeData.type)}]
        </span>
        <span>{menuName}</span>
      </GlEllipsis>
    )
  }

  return (
    <Loading loading={loading}>
      <Tree
        data={resourceTree}
        keys={{ value: 'id', children: 'children' }}
        label={getLabel}
        expandAll
      />
    </Loading>
  )
}

export const useTree = (props: Props) => {
  const { rowData } = props

  const { t } = useTranslation()
  const text = t('common.action.viewAssociatedResource', { ns: 'auth' })

  const onOpen = () => {
    const dialogInstance = GlDialogPlugin({
      onClose: () => {
        dialogInstance.hide()
      },
      header: text,
      footer: false,
      body: <DialogBody rowData={rowData} />
    })
  }

  return {
    t,
    text,
    onOpen
  }
}
