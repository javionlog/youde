import type { FormRules } from 'tdesign-react'
import type { PostAuthSignUpEmailData } from '@/global/api'
import { postAuthSignUpEmail } from '@/global/api'

type FormProps = Parameters<typeof GlForm>[0]

type Props = {
  refresh: () => void
}

export const useForm = (props: Props) => {
  const { refresh } = props
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)

  const rules = {
    name: getRequiredRules(),
    email: getRequiredRules(),
    username: getRequiredRules(),
    password: getRequiredRules()
  } satisfies FormRules<NonNullable<PostAuthSignUpEmailData['body'] & { username: string }>>
  const items = [
    {
      formItem: {
        name: 'name',
        label: t('label.name')
      },
      component: <Input clearable />
    },
    {
      formItem: {
        name: 'username',
        label: t('label.username')
      },
      component: <Input clearable />
    },
    {
      formItem: {
        name: 'email',
        label: t('label.email')
      },
      component: <Input clearable />
    },
    {
      formItem: {
        name: 'password',
        label: t('label.password')
      },
      component: <Input type='password' clearable />
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
        const params = fieldsValue as PostAuthSignUpEmailData['body']
        await postAuthSignUpEmail({ body: params })
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
