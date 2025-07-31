import type {
  GetAuthGetSessionResponse,
  PostAuthRbacListUserResourceTreeResponse
} from '@/modules/shared/api'
import {
  getAuthGetSession,
  postAuthRbacListUserResourceTree,
  postAuthSignOut
} from '@/modules/shared/api'
import { SideBar } from '@/modules/shared/layouts/side-bar'

export default () => {
  const navigate = useNavigate()

  const [session, setSession] = useState<GetAuthGetSessionResponse | null | undefined>(null)
  const [menus, setMenus] = useState<PostAuthRbacListUserResourceTreeResponse>([])
  useEffect(() => {
    getAuthGetSession().then(res => {
      setSession(res.data)
      postAuthRbacListUserResourceTree({ body: { userId: res.data?.user.id! } }).then(res => {
        setMenus(res.data ?? [])
      })
    })
  }, [])

  const handleSignout = () => {
    postAuthSignOut().then(() => {
      navigate('/sign-in')
    })
  }
  return (
    <>
      <div>
        <div>用户名: {session?.user.username}</div>
        <div>用户邮箱: {session?.user.email}</div>
        <Button onClick={handleSignout}>登出</Button>
      </div>
      <SideBar menus={menus} />
    </>
  )
}
