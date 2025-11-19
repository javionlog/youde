import type { FormRules } from 'tdesign-react'
import type {
  GetAdminCountryResponse,
  PatchAdminCountryData,
  PostAdminCountryData
} from '@/global/api'
import { patchAdminCountry, postAdminCountry } from '@/global/api'

type FormProps = Parameters<typeof GlForm>[0]

interface Props {
  mode: 'add' | 'edit'
  rowData?: GetAdminCountryResponse
  refresh: () => void
}

export const useForm = (props: Props) => {
  const { mode, rowData, refresh } = props
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)

  const rules = {
    region: getRequiredRules(),
    code: getRequiredRules(),
    enUs: getRequiredRules(),
    zhCn: getRequiredRules()
  } satisfies FormRules<NonNullable<PostAdminCountryData['body']>>
  const items = [
    {
      formItem: {
        name: 'region',
        label: t('label.region'),
        children: <GlInput />
      }
    },
    {
      formItem: {
        name: 'code',
        label: t('label.code'),
        children: <GlInput />
      }
    },
    {
      formItem: {
        name: 'enUs',
        label: t('label.english'),
        children: <GlInput />
      }
    },
    {
      formItem: {
        name: 'zhCn',
        label: t('label.simplifiedChinese'),
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
          } as PatchAdminCountryData['body']
          await patchAdminCountry({ body: params })
        } else {
          const params = fieldsValue as PostAdminCountryData['body']
          await postAdminCountry({ body: params })
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
