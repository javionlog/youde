import type { FormRules } from 'tdesign-react'
import type { GetAdminRoleResponse, PatchAdminRoleData, PostAdminRoleData } from '@/global/api'
import { patchAdminRole, postAdminRole } from '@/global/api'

type FormProps = Parameters<typeof GlForm>[0]

interface Props {
  mode: 'add' | 'edit'
  rowData?: GetAdminRoleResponse
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
  } satisfies FormRules<NonNullable<PostAdminRoleData['body']>>
  const items = [
    {
      formItem: {
        name: 'name',
        label: t('role.label.roleName', { ns: 'auth' }),
        children: <GlInput />
      }
    },
    {
      formItem: {
        name: 'enabled',
        label: t('label.enabled'),
        initialData: true,
        children: <Switch />
      }
    },
    {
      formItem: {
        name: 'remark',
        label: t('label.remark'),
        children: <GlInput />
      }
    }
  ] satisfies FormProps['items']

  const onOpen = async () => {
    form.reset()
    await Promise.resolve()
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
          } as PatchAdminRoleData['body']
          await patchAdminRole({ body: params })
        } else {
          const params = fieldsValue as PostAdminRoleData['body']
          await postAdminRole({ body: params })
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
