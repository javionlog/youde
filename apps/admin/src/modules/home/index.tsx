import { getSession, type GetSessionResponse } from '@/shared/api/auth'
import { Button } from 'tdesign-react'
import { signOut } from '@/shared/api/auth'

export default () => {
  const [session, setSession] = useState<GetSessionResponse>(null)
  useEffect(() => {
    getSession().then(setSession)
  }, [])
  return (
    <div>
      <div>用户名: {session?.user.username}</div>
      <div>用户邮箱: {session?.user.email}</div>
      <Button onClick={signOut}>登出</Button>
    </div>
  )
}
