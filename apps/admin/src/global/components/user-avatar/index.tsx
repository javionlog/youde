import { PoweroffIcon, UserCircleIcon } from 'tdesign-icons-react'
import type { DropdownOption } from 'tdesign-react'
import { postAuthSignOut } from '@/global/api'
import UserInfoDialog from './user-info-dialog'

export const UserAvatar = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const user = useUserStore(state => state.user)
  const [visible, setVisible] = useState(false)

  const themeModeOptions = [
    {
      content: t('label.userInfo'),
      value: '1',
      onClick: () => {
        setVisible(true)
      },
      prefixIcon: <UserCircleIcon size='14px' />
    },
    {
      content: t('action.signOut'),
      value: '2',
      onClick: async () => {
        await postAuthSignOut()
        const to = `/sign-in?redirect=${pathname}${search}`
        navigate(to)
        useUserStore.setState({ user: null })
        useResourceStore.setState({ resourceTree: [], resourceInited: false })
        useHttpStore.setState({ responseStatus: 0 })
      },
      prefixIcon: <PoweroffIcon size='14px' />
    }
  ] satisfies DropdownOption[]

  return (
    <>
      <Dropdown options={themeModeOptions} maxColumnWidth={'200px'} trigger='click'>
        <UserCircleIcon size='24px' />
        <span>{user?.username}</span>
      </Dropdown>
      <UserInfoDialog visible={visible} onCloseBtnClick={() => setVisible(false)} />
    </>
  )
}
