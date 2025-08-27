import { postAuthSignOut } from '@/global/api'
import LangSelect from '@/global/components/lang-select'
import { useResourceStore, useUserStore } from '@/global/stores'

export default () => {
  const navigate = useNavigate()
  const { setUser } = useUserStore()
  const { setResourceTree, setResourceInited } = useResourceStore()
  const user = useUserStore(state => state.user)
  const { t } = useTranslation()

  const handleSignout = async () => {
    await postAuthSignOut()
    navigate('/sign-in')
    setUser(null)
    setResourceTree([])
    setResourceInited(false)
  }
  return (
    <div>
      <LangSelect />
      <div>{`${t('label.username')}: ${user?.username}`}</div>
      <Button onClick={handleSignout}>{t('action.signOut')}</Button>
    </div>
  )
}
