import type { CustomValidator, FormRules } from 'tdesign-react'
import type { PatchAdminResourceData, PostAdminResourceData, ResourceNode } from '@/global/api'
import { patchAdminResource, postAdminResource } from '@/global/api'

type FormProps = Parameters<typeof GlForm>[0]

interface Props {
  mode?: 'add' | 'edit'
  rowData?: ResourceNode
  refresh: () => void
}

export const useForm = (props: Props) => {
  const { mode, rowData, refresh } = props
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState(false)

  const rules = {
    name: getRequiredRules(),
    type: getRequiredRules(),
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
  } satisfies FormRules<NonNullable<PostAdminResourceData['body']>>

  let items = [
    {
      formItem: {
        name: 'name',
        label: t('resource.label.resourceName', { ns: 'auth' }),
        children: <GlInput />
      }
    },
    {
      formItem: {
        name: 'type',
        label: t('resource.label.resourceType', { ns: 'auth' }),
        children: (
          <GlSelect
            disabled={mode === 'edit'}
            options={getOptions('RESOURCE_TYPE').filter(o => {
              if (mode === undefined) {
                return o.value === 'Menu' || o.value === 'Page'
              }
              if (mode === 'add') {
                if (rowData?.type === 'Menu') {
                  return o.value === 'Menu' || o.value === 'Page'
                }
                if (rowData?.type === 'Page') {
                  return o.value === 'Element'
                }
                return false
              }
              return true
            })}
          />
        )
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
        name: 'remark',
        label: t('label.remark'),
        children: <GlInput />
      }
    },
    {
      formItem: {
        name: 'path',
        label: t('label.path'),
        children: <GlInput />
      }
    },
    {
      formItem: {
        name: 'activePath',
        label: t('label.activePath'),
        children: <GlInput />
      }
    },
    {
      formItem: {
        name: 'component',
        label: t('label.component'),
        children: <GlInput />
      }
    },
    {
      formItem: {
        name: 'icon',
        label: t('label.icon'),
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
        name: 'isShow',
        label: t('resource.label.whetherToShow', { ns: 'auth' }),
        initialData: true,
        children: <Switch />
      }
    },
    {
      formItem: {
        name: 'isCache',
        label: t('resource.label.whetherToCache', { ns: 'auth' }),
        initialData: true,
        children: <Switch />
      }
    },
    {
      formItem: {
        name: 'isAffix',
        label: t('resource.label.whetherToAffix', { ns: 'auth' }),
        initialData: false,
        children: <Switch />
      }
    },
    {
      formItem: {
        name: 'isLink',
        label: t('resource.label.whetherToLink', { ns: 'auth' }),
        initialData: false,
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
          } as PatchAdminResourceData['body']
          await patchAdminResource({ body: params })
        } else if (mode === 'add') {
          const params = {
            ...fieldsValue,
            parentId: rowData?.id
          } as PostAdminResourceData['body']
          await postAdminResource({ body: params })
        } else {
          const params = fieldsValue as PostAdminResourceData['body']
          await postAdminResource({ body: params })
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
