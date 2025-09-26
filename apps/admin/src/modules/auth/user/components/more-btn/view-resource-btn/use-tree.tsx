import type { TreeProps } from 'tdesign-react'
import type { ResourceNode, User } from '@/global/api'
import { postAuthRbacListUserResourceTree } from '@/global/api'

interface Props {
  rowData: User
}

interface DialogBodyProps {
  rowData: User
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
        const treeList = await postAuthRbacListUserResourceTree({
          body: { userId: rowData.id }
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
    return <GlEllipsis>{menuName}</GlEllipsis>
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
