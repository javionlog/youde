import type { FormRules } from 'tdesign-react'
import type {
  PatchAdminTreasureCategoryData,
  PostAdminTreasureCategoryData,
  TreasureCategoryNode
} from '@/global/api'
import { patchAdminTreasureCategory, postAdminTreasureCategory } from '@/global/api'

type FormProps = Parameters<typeof GlForm>[0]

interface Props {
  mode?: 'add' | 'edit'
  rowData?: TreasureCategoryNode
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
  } satisfies FormRules<NonNullable<PostAdminTreasureCategoryData['body']>>

  let items = [
    {
      formItem: {
        name: 'name',
        label: t('treasure.label.categoryName', { ns: 'content' }),
        children: <GlInput />
      }
    },
    {
      formItem: {
        name: 'sort',
        label: t('label.sort'),
        children: <GlInputNumber min={0} decimalPlaces={0} theme='column' />
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

  if (mode === 'edit') {
    const appendItems = [
      {
        formItem: {
          name: 'createdAt',
          label: t('label.createdAt'),
          children: <GlEllipsis>{formatDate(rowData?.createdAt!)}</GlEllipsis>
        }
      },
      {
        formItem: {
          name: 'updatedAt',
          label: t('label.updatedAt'),
          children: <GlEllipsis>{formatDate(rowData?.updatedAt!)}</GlEllipsis>
        }
      },
      {
        formItem: {
          name: 'createdBy',
          label: t('label.createdBy'),
          children: <GlEllipsis>{rowData?.createdBy!}</GlEllipsis>
        }
      },
      {
        formItem: {
          name: 'updatedBy',
          label: t('label.updatedBy'),
          children: <GlEllipsis>{rowData?.updatedBy!}</GlEllipsis>
        }
      }
    ] satisfies FormProps['items']
    items = [...items, ...appendItems]
  }

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
          } as PatchAdminTreasureCategoryData['body']
          await patchAdminTreasureCategory({ body: params })
        } else if (mode === 'add') {
          const params = {
            ...fieldsValue,
            parentId: rowData?.id
          } as PostAdminTreasureCategoryData['body']
          await postAdminTreasureCategory({ body: params })
        } else {
          const params = fieldsValue as PostAdminTreasureCategoryData['body']
          await postAdminTreasureCategory({ body: params })
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
