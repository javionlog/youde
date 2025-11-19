import type { FormRules } from 'tdesign-react'
import type { GetAdminUserResponse, PatchAdminUserData, PostAdminUserData } from '@/global/api'
import { patchAdminUser, postAdminUser } from '@/global/api'

type FormProps = Parameters<typeof GlForm>[0]

interface Props {
  mode: 'add' | 'edit'
  rowData?: GetAdminUserResponse
  refresh: () => void
}

export const useForm = (props: Props) => {
  const { mode, rowData, refresh } = props
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)

  const rules =
    mode === 'edit'
      ? {
          username: getRequiredRules(),
          isAdmin: getRequiredRules(),
          enabled: getRequiredRules()
        }
      : ({
          username: getRequiredRules(),
          password: getRequiredRules(),
          isAdmin: getRequiredRules(),
          enabled: getRequiredRules()
        } satisfies FormRules<NonNullable<PostAdminUserData['body']>>)
  const items = (
    [
      {
        formItem: {
          name: 'username',
          label: t('label.username'),
          children: <GlInput />
        }
      },
      mode === 'edit'
        ? {}
        : {
            formItem: {
              name: 'password',
              label: t('label.password'),
              children: <GlInput type='password' />
            }
          },
      {
        formItem: {
          name: 'isAdmin',
          label: t('label.isAdmin'),
          initialData: false,
          children: <Switch />
        }
      },
      {
        formItem: {
          name: 'enabled',
          label: t('label.enabled'),
          initialData: true,
          children: <Switch />
        }
      }
    ] satisfies FormProps['items']
  ).filter(o => o.formItem?.children)

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
          } as PatchAdminUserData['body']
          await patchAdminUser({ body: params })
        } else {
          const params = fieldsValue as PostAdminUserData['body']
          await postAdminUser({ body: params })
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
