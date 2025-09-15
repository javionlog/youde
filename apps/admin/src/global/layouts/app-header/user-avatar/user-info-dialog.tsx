interface Props {
  visible: boolean
  onCloseBtnClick?: () => void
}

interface Item {
  label: string
  content: string
}

export default (props: Props) => {
  const { visible, onCloseBtnClick } = props
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
  ] satisfies Item[]

  return (
    <GlDialog
      visible={visible}
      onCloseBtnClick={onCloseBtnClick}
      header={t('label.userInfo')}
      footer={false}
    >
      <GlDescriptions items={items} />
    </GlDialog>
  )
}
