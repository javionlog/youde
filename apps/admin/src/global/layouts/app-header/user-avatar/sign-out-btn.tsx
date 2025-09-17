import { PoweroffIcon } from 'tdesign-icons-react'
import { postAuthSignOut } from '@/global/api'

export const SignOutBtn = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { pathname, search } = useLocation()

  const { run: onSignOut } = useThrottleFn(
    async () => {
      await postAuthSignOut()
      const to = `/sign-in?redirect=${pathname}${search}`
      navigate(to)
      useUserStore.setState({ user: null })
      useResourceStore.setState({ resourceTree: [], resourceInited: false })
      useHttpStore.setState({ responseStatus: 0 })
    },
    { wait: 500 }
  )
  return (
    <div onClick={onSignOut}>
      <PoweroffIcon size='14px' className='mr-2' />
      <span>{t('action.signOut')}</span>
    </div>
  )
}
