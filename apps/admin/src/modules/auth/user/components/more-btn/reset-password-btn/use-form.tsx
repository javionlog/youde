import type { RefObject } from 'react'
import type { DialogInstance, FormRules } from 'tdesign-react'
import type { GetAdminUserResponse, PatchAdminUserPasswordData } from '@/global/api'
import { patchAdminUserPassword } from '@/global/api'

type FormProps = Parameters<typeof GlForm>[0]

interface Props {
  rowData: GetAdminUserResponse
}

interface DialogBodyProps {
  ref?: RefObject<DialogBodyInstance | null>
  dialogRef: RefObject<DialogInstance | null>
  rowData: GetAdminUserResponse
}

interface DialogBodyInstance {
  getData: () => Promise<PatchAdminUserPasswordData['body'] | null>
}

const DialogBody = (props: DialogBodyProps) => {
  const { ref, rowData } = props

  const { t } = useTranslation()
  const [form] = Form.useForm()

  useImperativeHandle(ref, () => {
    return {
      getData: async () => {
        const validateResult = await form.validate()
        if (validateResult === true) {
          const fieldsValue = {
            ...form.getFieldsValue(true),
            id: rowData.id
          } as PatchAdminUserPasswordData['body']
          return fieldsValue
        }
        return null
      }
    }
  })

  const rules = {
    password: getRequiredRules()
  } satisfies FormRules<NonNullable<PatchAdminUserPasswordData['body']>>

  const items = [
    {
      formItem: {
        name: 'password',
        label: t('label.password')
      },
      component: <GlInput type='password' />
    }
  ] satisfies FormProps['items']

  return <GlForm form={form} rules={rules} items={items} />
}

export const useForm = (props: Props) => {
  const { rowData } = props
  const { t } = useTranslation()
  const dialogRef = useRef<DialogInstance>(null)
  const dialogBodyRef = useRef<DialogBodyInstance>(null)

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
          const params = await dialogBodyRef.current?.getData()
          if (params) {
            await patchAdminUserPassword({ body: params })
            MessagePlugin.success(t('message.operateSuccessful'))
            dialogInstance.hide()
          }
        } finally {
          dialogInstance.update({ confirmLoading: false })
        }
      },
      header: text,
      body: <DialogBody ref={dialogBodyRef} dialogRef={dialogRef} rowData={rowData} />
    })
  }

  const text = t('action.resetPassword')

  return {
    t,
    text,
    onOpen
  }
}
