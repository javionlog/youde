import type { RefObject } from 'react'
import type { DialogInstance, TreeInstanceFunctions, TreeNodeValue, TreeProps } from 'tdesign-react'
import type {
  GetAdminRoleResponse,
  GrantResourceNode,
  PostAdminRoleResourceRelationSetManyData
} from '@/global/api'
import {
  postAdminResourceRoleGrantResourceTree,
  postAdminRoleResourceRelationSetMany
} from '@/global/api'

interface Props {
  rowData: GetAdminRoleResponse
  refresh: () => void
}

interface DialogBodyProps {
  ref?: RefObject<DialogBodyInstance | null>
  dialogRef: RefObject<DialogInstance | null>
  rowData: GetAdminRoleResponse
}

interface DialogBodyInstance {
  getData: () => {
    resourceIds: TreeNodeValue[]
    resourceTree: GrantResourceNode[]
  }
}

const DialogBody = (props: DialogBodyProps) => {
  const { ref, dialogRef, rowData } = props

  const { t } = useTranslation()
  const lang = camelCase(useLocaleStore(state => state.lang))
  const [resourceTree, setResourceTree] = useState<GrantResourceNode[]>([])
  const [resourceValue, setResourceValue] = useState<TreeNodeValue[]>([])
  const [loading, setLoading] = useState(false)
  const treeRef = useRef<TreeInstanceFunctions>(null)
  const [elementVisible, setElementVisible] = useState(false)
  const [filterText, setFilterText] = useState('')

  useImperativeHandle(ref, () => {
    return {
      getData: () => {
        return {
          resourceIds: resourceValue,
          resourceTree
        }
      }
    }
  })

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true)
        setResourceValue([])
        const treeList = await postAdminResourceRoleGrantResourceTree({
          body: { roleId: rowData.id }
        }).then(r => r.data ?? [])
        setResourceTree(treeList)
        const resourceIds = flattenTree(treeList)
          .filter(o => o.grant)
          .map(o => o.id)
        setResourceValue(resourceIds)
      } finally {
        dialogRef.current?.update({ confirmLoading: false })
        setLoading(false)
      }
    }
    init()
  }, [])

  const getLabel: TreeProps['label'] = node => {
    const nodeData = node.data as GrantResourceNode
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
    const nodeData = node.data as GrantResourceNode
    const nodeChilren = node.getChildren(true)
    const nodeChilrenValues = Array.isArray(nodeChilren)
      ? nodeChilren.map(item => {
          return (item.data as GrantResourceNode).id
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
    const nodeData = node.data as GrantResourceNode
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
          const data = dialogBodyRef.current?.getData()!
          const createResourceIds = []
          const deleteResourceIds = []
          const diffList = flattenTree(data.resourceTree).map(item => {
            return {
              ...item,
              diff: {
                old: item.grant,
                new: data.resourceIds.includes(item.id)
              }
            }
          })
          for (const item of diffList) {
            if (item.diff.old !== item.diff.new) {
              if (item.diff.new) {
                createResourceIds.push(item.id)
              } else {
                deleteResourceIds.push(item.id)
              }
            }
          }

          const params = {
            roleId: rowData.id,
            createResourceIds,
            deleteResourceIds
          } satisfies PostAdminRoleResourceRelationSetManyData['body']
          await postAdminRoleResourceRelationSetMany({ body: params })
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
