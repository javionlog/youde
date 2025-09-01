import { getAuthGetSession, postAuthSignOut } from '@/global/api'

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
      <div className='flex items-center gap-2'>
        <LangSelect />
        <ThemeSelect />
      </div>
      <div>{`${t('label.username')}: ${user?.username}`}</div>
      <Button onClick={handleSignout}>{t('action.signOut')}</Button>
    </div>
  )
}
