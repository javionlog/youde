interface Props {
  visible: boolean
  onCloseBtnClick?: () => void
}

interface Item {
  label: string
  content: string
}

export default (props: Props) => {
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
    <Dialog
      visible={props.visible}
      onCloseBtnClick={props.onCloseBtnClick}
      header={t('label.userInfo')}
      footer={false}
      dialogClassName='w-[80%]! md:w-[640px]! lg:w-[960px]! xl:w-[1200px]!'
    >
      <ul className='grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {list.map(item => {
          return (
            <li key={item.label}>
              <div className='text-(--td-text-color-placeholder)'>{item.label}</div>
              <div>{item.content}</div>
            </li>
          )
        })}
      </ul>
    </Dialog>
  )
}
