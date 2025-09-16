import type { CustomValidator, FormRules } from 'tdesign-react'
import type {
  PostAuthRbacResourceCreateData,
  PostAuthRbacResourceUpdateData,
  ResourceNode
} from '@/global/api'
import { postAuthRbacResourceCreate, postAuthRbacResourceUpdate } from '@/global/api'

type FormProps = Parameters<typeof GlForm>[0]

type Props = {
  mode?: 'add' | 'edit'
  rowData?: ResourceNode
  refresh: () => void
}

export const useForm = (props: Props) => {
  const { mode, rowData, refresh } = props
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()
  const [initialData] = useState<Partial<PostAuthRbacResourceCreateData['body']>>(
    mode === 'edit' ? rowData : {}
  )
  const [confirmLoading, setConfirmLoading] = useState(false)

  const rules = {
    name: getRequiredRules({ form }),
    type: getRequiredRules({ form }),
    path: [
      {
        validator: (val => {
          return new Promise(resolve => {
            const type = form.getFieldValue('type') as ResourceNode['type']
            if (type === 'Page') {
              if (isEmpty(val)) {
                resolve({ message: t('message.required'), result: false })
              } else {
                resolve(true)
              }
            } else {
              resolve(true)
            }
          })
        }) as CustomValidator
      }
    ]
  } satisfies FormRules<NonNullable<PostAuthRbacResourceCreateData['body']>>
  const items = [
    {
      formItem: {
        name: 'name',
        label: t('resource.label.resourceName', { ns: 'auth' })
      },
      component: <Input clearable />
    },
    {
      formItem: {
        name: 'type',
        label: t('resource.label.resourceType', { ns: 'auth' })
      },
      component: (
        <Select
          clearable
          options={getOptions('RESOURCE_TYPE').filter(o => {
            if (mode === undefined) {
              return o.value !== 'Element'
            }
            return true
          })}
        />
      )
    },
    {
      formItem: {
        name: 'sort',
        label: t('label.sort')
      },
      component: <InputNumber min={0} decimalPlaces={0} theme='column' />
    },
    {
      formItem: {
        name: 'remark',
        label: t('label.remark')
      },
      component: <Input clearable />
    },
    {
      formItem: {
        name: 'path',
        label: t('label.path')
      },
      component: <Input clearable />
    },
    {
      formItem: {
        name: 'activePath',
        label: t('label.activePath')
      },
      component: <Input clearable />
    },
    {
      formItem: {
        name: 'component',
        label: t('label.component')
      },
      component: <Input clearable />
    },
    {
      formItem: {
        name: 'icon',
        label: t('label.icon')
      },
      component: <Input clearable />
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
        name: 'isCache',
        label: t('resource.label.whetherToCache', { ns: 'auth' })
      },
      component: <Switch />
    },
    {
      formItem: {
        name: 'isAffix',
        label: t('resource.label.whetherToAffix', { ns: 'auth' })
      },
      component: <Switch />
    },
    {
      formItem: {
        name: 'isLink',
        label: t('resource.label.whetherToLink', { ns: 'auth' })
      },
      component: <Switch />
    }
  ] satisfies FormProps['items']

  const onOpen = () => {
    setVisible(true)
    form.reset()
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
          } as PostAuthRbacResourceUpdateData['body']
          await postAuthRbacResourceUpdate({ body: params })
        } else if (mode === 'add') {
          const params = {
            ...fieldsValue,
            parentId: rowData?.id
          } as PostAuthRbacResourceCreateData['body']
          await postAuthRbacResourceCreate({ body: params })
        } else {
          const params = fieldsValue as PostAuthRbacResourceCreateData['body']
          await postAuthRbacResourceCreate({ body: params })
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
    initialData,
    rules,
    items,
    onOpen,
    onClose,
    onConfirm,
    confirmLoading
  }
}
