import { UserCircleIcon } from 'tdesign-icons-react'

type DescriptionsProps = Parameters<typeof GlDescriptions>[0]

export const ViewUserInfoBtn = () => {
  const { t } = useTranslation()
  const user = useUserStore(state => state.user)
  const items = [
    {
      label: t('label.name'),
      content: user?.name!
    },
    {
      label: t('label.username'),
      content: user?.username!
    },
    {
      label: t('label.email'),
      content: user?.email!
    }
  ] satisfies DescriptionsProps['items']

  const onOpen = () => {
    const dialogInstance = GlDialogPlugin({
      onClose: () => {
        dialogInstance.hide()
      },
      header: t('label.userInfo'),
      footer: false,
      body: <GlDescriptions items={items} />
    })
  }
  return (
    <div onClick={onOpen}>
      <UserCircleIcon size='14px' className='mr-2' />
      <span>{t('label.userInfo')}</span>
    </div>
  )
}
