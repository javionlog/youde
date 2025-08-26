import { Desktop1Icon, LockOnIcon } from 'tdesign-icons-react'
import type { FormProps, FormRules } from 'tdesign-react'
import type { PostAuthSignInUsernameData } from '@/global/api'
import { postAuthSignInUsername } from '@/global/api'
import { useUserStore } from '@/global/stores'

const { FormItem } = Form

const initialData = {
  username: 'admin',
  password: '12345678'
} satisfies PostAuthSignInUsernameData['body']

export default () => {
  const [formData] = useState(initialData)
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { setUser } = useUserStore()

  const rules = {
    username: getRequiredRules(),
    password: getRequiredRules()
  } satisfies FormRules<PostAuthSignInUsernameData['body']>

  const onSubmit: FormProps['onSubmit'] = async e => {
    if (e.validateResult === true) {
      const params = form.getFieldsValue(true) as typeof initialData
      const resData = await postAuthSignInUsername({ body: params }).then(r => r.data!)
      setUser(resData.user!)
      MessagePlugin.info('登录成功')
      const searchParams = new URLSearchParams(window.location.search)
      const redirectPath = searchParams.get('redirect') ?? '/home'
      navigate(redirectPath)
    }
  }

  return (
    <div className='grid content-center w-screen h-screen'>
      <div className='w-full max-w-lg mx-auto p-4'>
        <div className='border-1 border-gray-500 rounded p-4'>
          <Form form={form} labelWidth={0} rules={rules} onSubmit={onSubmit}>
            <FormItem name='username' initialData={formData.username}>
              <Input prefixIcon={<Desktop1Icon />} placeholder='请输入用户名' clearable />
            </FormItem>
            <FormItem name='password' initialData={formData.password}>
              <Input
                prefixIcon={<LockOnIcon />}
                type='password'
                placeholder='请输入密码'
                clearable
              />
            </FormItem>
            <FormItem>
              <Button theme='primary' type='submit' block>
                登录
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
  )
}
