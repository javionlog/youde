import { PoweroffIcon } from 'tdesign-icons-react'
import { postAuthSignOut } from '@/global/api'

export const SignOutBtn = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const [loading, setLoading] = useState(false)

  const onSignOut = async () => {
    if (loading) {
      return
    }
    try {
      setLoading(true)
      await postAuthSignOut()
      const to = `/sign-in?redirect=${pathname}${search}`
      navigate(to)
      useUserStore.setState({ user: null })
      useResourceStore.setState({ resourceTree: [], resourceInited: false })
      useHttpStore.setState({ responseStatus: 0 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div onClick={onSignOut}>
      <PoweroffIcon size='14px' className='mr-2' />
      <span>{t('action.signOut')}</span>
    </div>
  )
}
