import type { FormRules } from 'tdesign-react'
import type {
  GetAdminTreasureResponse,
  PatchAdminTreasureData,
  PostAdminTreasureCategoryTreeResponse,
  PostAdminTreasureData
} from '@/global/api'
import { patchAdminTreasure, postAdminTreasure, postAdminTreasureCategoryTree } from '@/global/api'

type FormProps = Parameters<typeof GlForm>[0]

interface Props {
  mode: 'add' | 'edit'
  rowData?: GetAdminTreasureResponse
  refresh: () => void
}

export const useForm = (props: Props) => {
  const { mode, rowData, refresh } = props
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)
  const lang = camelCase(useLocaleStore(state => state.lang))
  const [categoryOptions, setCategoryOptions] = useState<PostAdminTreasureCategoryTreeResponse>([])

  const finalCategoryOptions = useMemo(() => {
    const flatOptions = flattenTree(categoryOptions).map(item => {
      const categoryLocale = item.locales?.find(o => o.field === 'name')
      const categoryName = categoryLocale?.[lang as 'enUs'] ?? item.name
      return {
        ...item,
        name: categoryName
      }
    })
    return buildTree(flatOptions)
  }, [categoryOptions, lang])

  const rules = {
    categoryId: getRequiredRules(),
    title: getRequiredRules(),
    description: getRequiredRules(),
    fee: getRequiredRules(),
    countryCode: getRequiredRules()
  } satisfies FormRules<NonNullable<PostAdminTreasureData['body']>>

  const items = [
    {
      formItem: {
        name: 'categoryId',
        label: t('treasure.label.category', { ns: 'content' }),
        children: (
          <GlCascader
            keys={{ label: 'name', value: 'id', children: 'children' }}
            options={finalCategoryOptions}
          />
        )
      }
    },
    {
      formItem: {
        name: 'title',
        label: t('label.title'),
        children: <GlInput />
      }
    },
    {
      formItem: {
        name: 'description',
        label: t('label.description'),
        children: <GlInput />
      }
    },
    {
      formItem: {
        name: 'fee',
        label: t('label.fee'),
        children: <GlSelect options={getOptions('TREASURE_FEE')} />
      }
    },
    {
      formItem: {
        name: 'countryCode',
        label: t('label.country'),
        children: <GlSelect options={getOptions('TREASURE_FEE')} />
      }
    },
    {
      formItem: {
        name: 'url',
        label: t('label.url'),
        children: <GlInput />
      }
    },
    {
      formItem: {
        name: 'cover',
        label: t('label.cover'),
        children: <GlInput />
      }
    },
    {
      formItem: {
        name: 'content',
        label: t('label.content'),
        children: <GlTextArea />
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
    const categoryRes = await postAdminTreasureCategoryTree({ body: {} })
    setCategoryOptions(categoryRes.data ?? [])
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
          } as PatchAdminTreasureData['body']
          await patchAdminTreasure({ body: params })
        } else {
          const params = fieldsValue as PostAdminTreasureData['body']
          await postAdminTreasure({ body: params })
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
