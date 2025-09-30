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

  const { t } = useTranslation()
  const lang = camelCase(useLocaleStore(state => state.lang))
  const [resourceTree, setResourceTree] = useState<ResourceNode[]>([])
  const [resourceValue, setResourceValue] = useState<TreeNodeValue[]>([])
  const [loading, setLoading] = useState(false)
  const treeRef = useRef<TreeInstanceFunctions>(null)
  const [elementVisible, setElementVisible] = useState(false)
  const [filterText, setFilterText] = useState('')

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
    const nodeData = node.data as ResourceNode
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

  const onChange: TreeProps['onChange'] = (value: TreeNodeValue[], context) => {
    const vlaueList = value as string[]
    const { node } = context
    const nodeData = node.data as ResourceNode
    const nodeChilren = node.getChildren(true)
    const nodeChilrenValues = Array.isArray(nodeChilren)
      ? nodeChilren.map(item => {
          return (item.data as ResourceNode).id
        })
      : []
    const nodeValues = vlaueList.includes(nodeData.id)
      ? [...vlaueList, ...nodeChilrenValues]
      : vlaueList.filter(val => {
          return !nodeChilrenValues.includes(val)
        })
    const finalValues = uniq(nodeValues)
    setResourceValue(finalValues)
  }

  const filterTree: TreeProps['filter'] = node => {
    const nodeData = node.data as ResourceNode
    const preCondition = elementVisible ? true : nodeData.type !== 'Element'
    if (filterText.trim() === '') {
      return preCondition
    }
    const menuLocale = nodeData.locales?.find(o => o.field === 'name')
    const menuName = menuLocale?.[lang as 'enUs'] ?? nodeData.name
    return preCondition && menuName.includes(filterText.trim())
  }

  return (
    <Loading loading={loading}>
      <div className='flex flex-col gap-4'>
        <GlGrid maxRows={10} columns={{ xs: 2, sm: 2, md: 3, lg: 4, xl: 5, '2xl': 6 }}>
          <GlGridItem index={1}>
            <GlCheckbox
              checked={elementVisible}
              onChange={setElementVisible}
              className='overflow-hidden'
            >
              {t('common.message.showElement', { ns: 'auth' })}
            </GlCheckbox>
          </GlGridItem>
          <GlGridItem index={2}>
            <GlInputAdornment prepend={t('action.search')}>
              <GlInput value={filterText} onChange={setFilterText} className='min-w-0' />
            </GlInputAdornment>
          </GlGridItem>
        </GlGrid>
        <Tree
          ref={treeRef}
          value={resourceValue}
          data={resourceTree}
          keys={{ value: 'id', children: 'children' }}
          label={getLabel}
          filter={filterTree}
          valueMode='all'
          checkable
          expandAll
          checkStrictly
          allowFoldNodeOnFilter
          onChange={onChange}
        />
      </div>
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
