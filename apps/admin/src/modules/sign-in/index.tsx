import type { FormProps } from 'tdesign-react'
import type { PostAuthSignInUsernameData } from '@/global/api'
import { postAuthSignInUsername } from '@/global/api'
import { useResourceStore, useUserStore } from '@/global/stores'

const { FormItem } = Form

const initialData = {
  username: 'admin',
  password: '12345678'
} satisfies PostAuthSignInUsernameData['body']

export default () => {
  const navigate = useNavigate()
  const [formData] = useState(initialData)
  const [form] = Form.useForm()
  const { setUser } = useUserStore()
  const { fetchResourceTree } = useResourceStore()
  const onSubmit: FormProps['onSubmit'] = async e => {
    if (e.validateResult === true) {
      const params = form.getFieldsValue(true) as typeof initialData
      const resData = await postAuthSignInUsername({ body: params }).then(r => r.data!)
      setUser(resData.user!)
      await fetchResourceTree()
      MessagePlugin.info('登录成功')
      navigate('/home')
    }
  }

  return (
    <div className='w-xs'>
      <Form form={form} labelWidth={0} onSubmit={onSubmit}>
        <FormItem name='username' rules={[{ required: true }]} initialData={formData.username}>
          <Input clearable placeholder='请输入用户名' />
        </FormItem>
        <FormItem name='password' rules={[{ required: true }]} initialData={formData.password}>
          <Input type='password' clearable placeholder='请输入密码' />
        </FormItem>
        <FormItem>
          <Button theme='primary' type='submit' block>
            登录
          </Button>
        </FormItem>
      </Form>
    </div>
  )
}
