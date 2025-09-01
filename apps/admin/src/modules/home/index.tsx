import { getAuthGetSession, postAuthSignOut } from '@/global/api'

export default () => {
  const navigate = useNavigate()
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
      <Button onClick={handleSignout}>{t('action.signOut')}</Button>
    </div>
  )
}
