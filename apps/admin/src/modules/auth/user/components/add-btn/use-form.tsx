import type { FormRules } from 'tdesign-react'
import type { PostAdminUserData } from '@/global/api'
import { postAdminUser } from '@/global/api'

type FormProps = Parameters<typeof GlForm>[0]

interface Props {
  refresh: () => void
}

export const useForm = (props: Props) => {
  const { refresh } = props
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)

  const rules = {
    username: getRequiredRules(),
    password: getRequiredRules(),
    isAdmin: getRequiredRules(),
    enabled: getRequiredRules()
  } satisfies FormRules<NonNullable<PostAdminUserData['body']>>
  const items = [
    {
      formItem: {
        name: 'username',
        label: t('label.username')
      },
      component: <GlInput />
    },
    {
      formItem: {
        name: 'password',
        label: t('label.password')
      },
      component: <GlInput type='password' />
    },
    {
      formItem: {
        name: 'isAdmin',
        label: t('label.isAdmin'),
        initialData: false
      },
      component: <Switch />
    },
    {
      formItem: {
        name: 'enabled',
        label: t('label.enabled'),
        initialData: true
      },
      component: <Switch />
    }
  ] satisfies FormProps['items']

  const onOpen = () => {
    form.reset()
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
        const params = fieldsValue as PostAdminUserData['body']
        await postAdminUser({ body: params })
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
