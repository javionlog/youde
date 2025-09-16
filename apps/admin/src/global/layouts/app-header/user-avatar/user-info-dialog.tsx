interface Props {
  visible: boolean
  onClose?: () => void
}

type DescriptionsProps = Parameters<typeof GlDescriptions>[0]

export default (props: Props) => {
  const { visible, onClose } = props
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

  return (
    <GlDialog visible={visible} onClose={onClose} header={t('label.userInfo')} footer={false}>
      <GlDescriptions items={items} />
    </GlDialog>
  )
}
