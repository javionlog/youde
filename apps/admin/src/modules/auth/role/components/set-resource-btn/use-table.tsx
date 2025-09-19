import type { Role } from '@/global/api'
import { postAuthRbacListRoleResources } from '@/global/api'
import type { GlTableRef } from '@/global/components/gl-table'

type SearchProps = Parameters<typeof GlSearch>[0]

type Props = {
  rowData?: Role
  refresh: () => void
}

export const useTable = (props: Props) => {
  const { rowData } = props

  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const [confirmLoading] = useState(false)
  const ref = useRef<GlTableRef>(null)

  const api = postAuthRbacListRoleResources
  const params = { roleId: rowData?.id }

  const search = {
    items: [
      {
        formItem: {
          name: 'resourceName',
          label: t('resource.label.resourceName', { ns: 'auth' })
        },
        component: <Input clearable />
      }
    ]
  } satisfies SearchProps

  const columns = [
    {
      colKey: 'name',
      title: t('resource.label.resourceName', { ns: 'auth' })
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
  ] satisfies GlTalbeColumns

  const getResources = () => {
    ref.current?.fetch()
  }
  const onOpen = async () => {
    setVisible(true)
  }

  const onOpened = async () => {
    ref.current?.form.reset()
    getResources()
  }

  const onClose = () => {
    setVisible(false)
  }

  const onConfirm = async () => {}

  return {
    t,
    ref,
    visible,
    search,
    columns,
    confirmLoading,
    params,
    api,
    onOpen,
    onOpened,
    onClose,
    onConfirm
  }
}
