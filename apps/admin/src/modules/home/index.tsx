import { postAuthSignOut } from '@/global/api'
import { useResourceStore, useUserStore } from '@/global/stores'

export default () => {
  const navigate = useNavigate()
  const { setUser } = useUserStore()
  const { setResourceTree } = useResourceStore()
  const user = useUserStore(state => state.user)

  const handleSignout = () => {
    postAuthSignOut().then(() => {
      setUser(null)
      setResourceTree([])
      navigate('/sign-in')
    })
  }
  return (
    <>
      <div>
        <div>姓名: {user?.name}</div>
        <div>用户名: {user?.username}</div>
        <div>用户邮箱: {user?.email}</div>
        <Button onClick={handleSignout}>登出</Button>
      </div>
    </>
  )
}
