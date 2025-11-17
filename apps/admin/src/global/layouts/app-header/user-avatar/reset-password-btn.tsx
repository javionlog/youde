import type { RefObject } from 'react'
import { UserPasswordIcon } from 'tdesign-icons-react'
import type { DialogInstance, FormRules } from 'tdesign-react'
import type { PatchAdminUserSelfPasswordData } from '@/global/api'
import { patchAdminUserSelfPassword } from '@/global/api'

type FormProps = Parameters<typeof GlForm>[0]

interface DialogBodyProps {
  ref?: RefObject<DialogBodyInstance | null>
  dialogRef: RefObject<DialogInstance | null>
}

interface DialogBodyInstance {
  getData: () => Promise<PatchAdminUserSelfPasswordData['body'] | null>
}

const DialogBody = (props: DialogBodyProps) => {
  const { ref } = props

  const user = useUserStore(state => state.user)
  const { t } = useTranslation()
  const [form] = Form.useForm()

  useImperativeHandle(ref, () => {
    return {
      getData: async () => {
        const validateResult = await form.validate()
        if (validateResult === true) {
          const fieldsValue = {
            ...form.getFieldsValue(true),
            id: user?.id
          } as PatchAdminUserSelfPasswordData['body']
          return fieldsValue
        }
        return null
      }
    }
  })

  const rules = {
    oldPassword: getRequiredRules(),
    newPassword: getRequiredRules(),
    confirmPassword: [
      ...getRequiredRules(),
      {
        validator: val => {
          return form.getFieldValue('newPassword') === val
        },
        message: t('message.twoPasswordInconsistentTip')
      }
    ]
  } satisfies FormRules<
    NonNullable<PatchAdminUserSelfPasswordData['body'] & { confirmPassword: string }>
  >

  const items = [
    {
      formItem: {
        name: 'oldPassword',
        label: t('label.oldPassword')
      },
      component: <GlInput type='password' />
    },
    {
      formItem: {
        name: 'newPassword',
        label: t('label.newPassword')
      },
      component: <GlInput type='password' />
    },
    {
      formItem: {
        name: 'confirmPassword',
        label: t('label.confirmPassword')
      },
      component: <GlInput type='password' />
    }
  ].filter(o => o.component) satisfies FormProps['items']

  return <GlForm form={form} rules={rules} items={items} />
}

export const ResetPasswordBtn = () => {
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
            await patchAdminUserSelfPassword({ body: params })
            MessagePlugin.success(t('message.operateSuccessful'))
            dialogInstance.hide()
          }
        } finally {
          dialogInstance.update({ confirmLoading: false })
        }
      },
      header: text,
      body: <DialogBody ref={dialogBodyRef} dialogRef={dialogRef} />
    })
  }

  // const onConfirm = async () => {
  //   const validateResult = await form.validate()
  //   if (validateResult === true) {
  //     try {
  //       setConfirmLoading(true)
  //       const fieldsValue = form.getFieldsValue(true)
  //       const params = {
  //         ...fieldsValue,
  //         id: user?.id
  //       } as PatchAdminUserSelfPasswordData['body']
  //       await patchAdminUserSelfPassword({ body: params })

  //       MessagePlugin.success(t('message.operateSuccessful'))
  //       onClose()
  //     } finally {
  //       setConfirmLoading(false)
  //     }
  //   }
  // }

  const text = t('action.resetPassword')

  return (
    <div onClick={onOpen}>
      <UserPasswordIcon size='14px' className='mr-2' />
      <span>{text}</span>
    </div>
  )
}
