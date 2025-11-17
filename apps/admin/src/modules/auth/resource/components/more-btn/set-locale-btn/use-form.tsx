import type { RefObject } from 'react'
import type { DialogInstance, FormRules, TabPanelProps, TabValue } from 'tdesign-react'

import type {
  GetAdminResourceLocaleResponse,
  PostAdminResourceLocaleData,
  ResourceNode
} from '@/global/api'
import { patchAdminResourceLocale, postAdminResourceLocale } from '@/global/api'

type FormProps = Parameters<typeof GlForm>[0]

interface Props {
  rowData: ResourceNode
  refresh: () => void
}

interface DialogBodyProps {
  ref?: RefObject<DialogBodyInstance | null>
  dialogRef: RefObject<DialogInstance | null>
  rowData: ResourceNode
}

type VoidFunction = (...args: any[]) => void

interface DialogFormProps {
  ref?: RefObject<DialogBodyInstance | null> | VoidFunction
  dialogRef: RefObject<DialogInstance | null>
  rowData: ResourceNode
  tabValue: TabValue
}

interface DialogBodyInstance {
  getData: () => Promise<NonNullable<GetAdminResourceLocaleResponse>>
}

const DialogForm = (props: DialogFormProps) => {
  const { ref, rowData, tabValue } = props
  const localeItem = rowData.locales?.find(o => o.field === tabValue)

  const { t } = useTranslation()
  const [form] = Form.useForm()

  useImperativeHandle(ref, () => {
    return {
      getData: async () => {
        const validateResult = await form.validate()
        if (validateResult === true) {
          return {
            ...form.getFieldsValue(true),
            id: localeItem?.id
          } as NonNullable<GetAdminResourceLocaleResponse>
        }
        return null
      }
    }
  })

  useEffect(() => {
    const init = async () => {
      form.reset()
      await Promise.resolve()
      if (localeItem) {
        form.setFieldsValue(localeItem)
      }
      form.clearValidate()
    }
    init()
  }, [])

  const rules = {
    zhCn: getRequiredRules(),
    enUs: getRequiredRules()
  } satisfies FormRules<NonNullable<PostAdminResourceLocaleData['body']>>

  const items = [
    {
      formItem: {
        name: 'enUs',
        label: t('label.english')
      },
      component: <GlInput />
    },
    {
      formItem: {
        name: 'zhCn',
        label: t('label.simplifiedChinese')
      },
      component: <GlInput />
    }
  ] satisfies FormProps['items']

  return <GlForm form={form} rules={rules} items={items} className='my-5' />
}

const DialogBody = (props: DialogBodyProps) => {
  const { ref, dialogRef, rowData } = props

  const { t } = useTranslation()
  const formRefs = useRef<DialogBodyInstance[]>([])
  const tabs = [
    {
      label: t('resource.label.resourceName', { ns: 'auth' }),
      value: 'name'
    }
  ] satisfies TabPanelProps[]
  const [tabValue, setTabValue] = useState<TabValue>(tabs[0].value)
  const { GlTabPanel } = GlTabs

  useImperativeHandle(ref, () => {
    return {
      getData: async () => {
        const tabIndex = tabs.findIndex(o => o.value === tabValue)
        const data = await formRefs.current[tabIndex].getData()
        return data
      }
    }
  })

  return (
    <GlTabs value={tabValue} onChange={setTabValue}>
      {tabs.map((item, index) => {
        return (
          <GlTabPanel key={item.value} {...item}>
            <DialogForm
              ref={(el: DialogBodyInstance) => {
                formRefs.current[index] = el
              }}
              dialogRef={dialogRef}
              rowData={rowData}
              tabValue={item.value}
            />
          </GlTabPanel>
        )
      })}
    </GlTabs>
  )
}

export const useForm = (props: Props) => {
  const { rowData, refresh } = props

  const { t } = useTranslation()
  const dialogRef = useRef<DialogInstance>(null)
  const dialogBodyRef = useRef<DialogBodyInstance>(null)

  const text = t('common.action.setLocale', { ns: 'auth' })

  const onOpen = async () => {
    const dialogInstance = GlDialogPlugin({
      onClose: () => {
        dialogInstance.hide()
      },
      onOpened: () => {
        dialogRef.current = dialogInstance
      },
      onConfirm: async () => {
        try {
          dialogInstance.update({
            confirmLoading: true
          })
          const data = await dialogBodyRef.current?.getData()
          if (!data) {
            return
          }
          if (data.id) {
            await patchAdminResourceLocale({ body: data })
          } else {
            await postAdminResourceLocale({ body: data })
          }
          MessagePlugin.success(t('message.operateSuccessful'))
          dialogInstance.hide()
          refresh()
        } finally {
          dialogInstance.update({ confirmLoading: false })
        }
      },
      header: text,
      body: <DialogBody ref={dialogBodyRef} dialogRef={dialogRef} rowData={rowData} />
    })
  }

  return {
    t,
    text,
    onOpen
  }
}
