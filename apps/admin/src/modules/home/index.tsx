import { getAuthGetSession, postAuthSignOut } from '@/global/api'
import LangSelect from '@/global/components/lang-select'
import { useHttpStore, useResourceStore, useUserStore } from '@/global/stores'

export default () => {
  const navigate = useNavigate()
  const user = useUserStore(state => state.user)
  const { t } = useTranslation()

  useEffect(() => {
    getAuthGetSession()
  }, [])

  const handleSignout = async () => {
    await postAuthSignOut()
    navigate('/sign-in')
    useUserStore.setState({ user: null })
    useResourceStore.setState({ resourceTree: [], resourceInited: false })
    useHttpStore.setState({ responseStatus: 0 })
  }
  return (
    <div>
      <LangSelect />
      <div>{`${t('label.username')}: ${user?.username}`}</div>
      <Button onClick={handleSignout}>{t('action.signOut')}</Button>
    </div>
  )
}
