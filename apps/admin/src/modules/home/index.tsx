import type { GetAuthGetSessionResponse } from '@/modules/shared/api'
import { getAuthGetSession, postAuthSignOut } from '@/modules/shared/api'

export default () => {
  const navigate = useNavigate()

  const [session, setSession] = useState<GetAuthGetSessionResponse | null | undefined>(null)
  useEffect(() => {
    getAuthGetSession().then((res) => {
      setSession(res.data)
    })
  }, [])

  const handleSignout = () => {
    postAuthSignOut().then(() => {
      navigate('/sign-in')
    })
  }
  return (
    <div>
      <div>用户名: {session?.user.username}</div>
      <div>用户邮箱: {session?.user.email}</div>
      <Button onClick={handleSignout}>登出</Button>
    </div>
  )
}
