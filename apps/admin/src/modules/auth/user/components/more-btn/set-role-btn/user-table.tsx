import type {
  PostAuthRbacListUserRolesWithGrantResponse,
  PostAuthRbacUserRoleRelationCreateData,
  User
} from '@/global/api'
import {
  postAuthRbacListUserRolesWithGrant,
  postAuthRbacUserRoleRelationCreate,
  postAuthRbacUserRoleRelationDelete
} from '@/global/api'

interface Props {
  rowData: User
}

interface DialogBodyProps {
  rowData: User
}

const DialogBody = (props: DialogBodyProps) => {
  const { rowData } = props

  const { t } = useTranslation()
  const ref = useRef<GlTableRef>(null)
  const [loading, setLoading] = useState(false)

  const columns = [
    {
      colKey: 'grant',
      title: t('common.action.grant', { ns: 'auth' }),
      fixed: 'left',
      edit: {
        component: Switch,
        keepEditMode: true,
        on: () => {
          return {
            onChange: async (context: {
              editedRow: PostAuthRbacListUserRolesWithGrantResponse['records'][number]
            }) => {
              try {
                setLoading(true)
                const { id, grant } = context.editedRow
                const params: PostAuthRbacUserRoleRelationCreateData['body'] = {
                  userId: rowData.id,
                  roleId: id
                }
                if (grant) {
                  await postAuthRbacUserRoleRelationCreate({ body: params })
                } else {
                  await postAuthRbacUserRoleRelationDelete({ body: params })
                }
                ref.current?.fetch()
                MessagePlugin.success(t('message.operateSuccessful'))
              } finally {
                setLoading(false)
              }
            }
          }
        }
      }
    },
    {
      colKey: 'name',
      title: t('role.label.roleName', { ns: 'auth' })
    },
    {
      colKey: 'enabled',
      title: t('label.enabled'),
      cellRenderType: 'boolean'
    },
    {
      colKey: 'remark',
      title: t('label.remark')
    },
    {
      colKey: 'createdAt',
      title: t('label.createdAt'),
      cellRenderType: 'datetime'
    },
    {
      colKey: 'updatedAt',
      title: t('label.updatedAt'),
      cellRenderType: 'datetime'
    },
    {
      colKey: 'createdBy',
      title: t('label.createdBy')
    },
    {
      colKey: 'updatedBy',
      title: t('label.updatedBy')
    }
  ] satisfies GlTalbeColumns<PostAuthRbacListUserRolesWithGrantResponse['records'][number]>

  return (
    <Loading loading={loading}>
      <GlTable
        ref={ref}
        rowKey='id'
        columns={columns}
        maxHeight='100%'
        params={{ userId: rowData.id, enabled: true }}
        api={postAuthRbacListUserRolesWithGrant}
      />
    </Loading>
  )
}

export const useTable = (props: Props) => {
  const { rowData } = props

  const { t } = useTranslation()
  const text = t('common.action.setRole', { ns: 'auth' })

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
