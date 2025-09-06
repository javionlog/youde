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
  const list = [
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
      <ul className='grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
        {list.map(item => {
          return (
            <li key={item.label}>
              <div className='text-(--td-text-color-placeholder)'>{item.label}</div>
              <div>{item.content}</div>
            </li>
          )
        })}
      </ul>
    </GlDialog>
  )
}
