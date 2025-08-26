import { postAuthSignOut } from '@/global/api'
import { useResourceStore, useUserStore } from '@/global/stores'

export default () => {
  const navigate = useNavigate()
  const { setUser } = useUserStore()
  const { setResourceTree, setResourceInited } = useResourceStore()
  const user = useUserStore(state => state.user)

  const handleSignout = async () => {
    await postAuthSignOut()
    navigate('/sign-in')
    setUser(null)
    setResourceTree([])
    setResourceInited(false)
  }
  return (
    <div>
      <div>姓名: {user?.name}</div>
      <div>用户名: {user?.username}</div>
      <div>用户邮箱: {user?.email}</div>
      <Button onClick={handleSignout}>登出</Button>
    </div>
  )
}
