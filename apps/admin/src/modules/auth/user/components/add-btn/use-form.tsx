import type { FormRules } from 'tdesign-react'
import type { PostAuthRbacUserCreateData } from '@/global/api'
import { postAuthRbacUserCreate } from '@/global/api'

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
    name: getRequiredRules(),
    username: getRequiredRules(),
    email: getRequiredRules(),
    password: getRequiredRules()
  } satisfies FormRules<NonNullable<PostAuthRbacUserCreateData['body']>>
  const items = [
    {
      formItem: {
        name: 'name',
        label: t('label.name')
      },
      component: <GlInput />
    },
    {
      formItem: {
        name: 'username',
        label: t('label.username')
      },
      component: <GlInput />
    },
    {
      formItem: {
        name: 'displayUsername',
        label: t('label.displayUsername')
      },
      component: <GlInput />
    },
    {
      formItem: {
        name: 'email',
        label: t('label.email')
      },
      component: <GlInput />
    },
    {
      formItem: {
        name: 'password',
        label: t('label.password')
      },
      component: <GlInput type='password' />
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
        const params = fieldsValue as PostAuthRbacUserCreateData['body']
        await postAuthRbacUserCreate({ body: params })
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
