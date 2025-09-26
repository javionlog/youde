import type { RefObject } from 'react'
import type { DialogInstance, TreeInstanceFunctions, TreeNodeValue, TreeProps } from 'tdesign-react'
import type { PostAuthRbacRoleResourceRelationBatchSetData, ResourceNode, Role } from '@/global/api'
import {
  postAuthRbacListResourceTree,
  postAuthRbacRoleResourceRelationBatchSet,
  postAuthRbacRoleResourceRelationList
} from '@/global/api'

interface Props {
  rowData: Role
  refresh: () => void
}

interface DialogBodyProps {
  ref?: RefObject<DialogBodyInstance | null>
  dialogRef: RefObject<DialogInstance | null>
  rowData: Role
}

interface DialogBodyInstance {
  getData: () => {
    resourceIds: TreeNodeValue[]
  }
}

const DialogBody = (props: DialogBodyProps) => {
  const { ref, dialogRef, rowData } = props

  const lang = camelCase(useLocaleStore(state => state.lang))
  const [resourceTree, setResourceTree] = useState<ResourceNode[]>([])
  const [resourceValue, setResourceValue] = useState<TreeNodeValue[]>([])
  const [loading, setLoading] = useState(false)
  const treeRef = useRef<TreeInstanceFunctions>(null)

  useImperativeHandle(ref, () => {
    return {
      getData: () => {
        return {
          resourceIds: resourceValue
        }
      }
    }
  })

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true)
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
        dialogRef.current?.update({ confirmLoading: false })
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

  const onChange: TreeProps['onChange'] = (value: TreeNodeValue[]) => {
    setResourceValue(value)
  }

  return (
    <Loading loading={loading}>
      <Tree
        ref={treeRef}
        value={resourceValue}
        data={resourceTree}
        keys={{ value: 'id', children: 'children' }}
        label={getLabel}
        checkable
        expandAll
        onChange={onChange}
      />
    </Loading>
  )
}

export const useTree = (props: Props) => {
  const { rowData, refresh } = props

  const { t } = useTranslation()
  const dialogRef = useRef<DialogInstance>(null)
  const dialogBodyRef = useRef<DialogBodyInstance>(null)
  const text = t('common.action.setResource', { ns: 'auth' })

  const onOpen = () => {
    const dialogInstance = GlDialogPlugin({
      confirmLoading: true,
      onClose: () => {
        dialogInstance.hide()
      },
      onOpened: () => {
        dialogRef.current = dialogInstance
      },
      onConfirm: async () => {
        try {
          dialogInstance.update({
            confirmLoading: true
          })

          const params = {
            roleId: rowData.id,
            ...dialogBodyRef.current?.getData()!
          } satisfies PostAuthRbacRoleResourceRelationBatchSetData['body']
          await postAuthRbacRoleResourceRelationBatchSet({ body: params })
          MessagePlugin.success(t('message.operateSuccessful'))
          dialogInstance.hide()
          refresh()
        } finally {
          dialogInstance.update({ confirmLoading: false })
        }
      },

      header: text,
      body: <DialogBody ref={dialogBodyRef} dialogRef={dialogRef} rowData={rowData} />
    })
  }

  return {
    t,
    text,
    onOpen
  }
}
