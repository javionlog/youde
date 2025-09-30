import type { FormRules } from 'tdesign-react'
import type { PostAuthRbacRoleCreateData, PostAuthRbacRoleUpdateData, Role } from '@/global/api'
import { postAuthRbacRoleCreate, postAuthRbacRoleUpdate } from '@/global/api'

type FormProps = Parameters<typeof GlForm>[0]

interface Props {
  mode: 'add' | 'edit'
  rowData?: Role
  refresh: () => void
}

export const useForm = (props: Props) => {
  const { mode, rowData, refresh } = props
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)

  const rules = {
    name: getRequiredRules()
  } satisfies FormRules<NonNullable<PostAuthRbacRoleCreateData['body']>>
  const items = [
    {
      formItem: {
        name: 'name',
        label: t('role.label.roleName', { ns: 'auth' })
      },
      component: <GlInput />
    },
    {
      formItem: {
        name: 'enabled',
        label: t('label.enabled')
      },
      component: <Switch />
    },
    {
      formItem: {
        name: 'remark',
        label: t('label.remark')
      },
      component: <GlInput />
    }
  ] satisfies FormProps['items']

  const onOpen = async () => {
    const defaultData: Partial<Role> = {
      enabled: true
    }
    form.reset()
    await Promise.resolve()
    form.setFieldsValue(defaultData)
    if (mode === 'edit') {
      form.setFieldsValue(rowData!)
    }
    form.clearValidate()
    setVisible(true)
  }

  const onClose = () => {
    setVisible(false)
  }

  const onConfirm = async () => {
    const validateResult = await form.validate()
    if (validateResult === true) {
      try {
        setConfirmLoading(true)
        const fieldsValue = form.getFieldsValue(true)
        if (mode === 'edit') {
          const params = {
            ...fieldsValue,
            id: rowData?.id
          } as PostAuthRbacRoleUpdateData['body']
          await postAuthRbacRoleUpdate({ body: params })
        } else {
          const params = fieldsValue as PostAuthRbacRoleCreateData['body']
          await postAuthRbacRoleCreate({ body: params })
        }
        MessagePlugin.success(t('message.operateSuccessful'))
        onClose()
        refresh()
      } finally {
        setConfirmLoading(false)
      }
    }
  }

  return {
    t,
    mode,
    visible,
    form,
    rules,
    items,
    onOpen,
    onClose,
    onConfirm,
    confirmLoading
  }
}
