import { signIn } from '@/shared/api/auth'
import type { FormProps } from 'tdesign-react'

const { FormItem } = Form

const initialData = {
  username: 'admin2',
  password: '12345678'
}

export default () => {
  const navigate = useNavigate()
  const [formData] = useState(initialData)
  const [form] = Form.useForm()
  const onSubmit: FormProps['onSubmit'] = e => {
    if (e.validateResult === true) {
      const params = form.getFieldsValue(true) as typeof initialData
      signIn(params).then(() => {
        MessagePlugin.info('登录成功')
        navigate('/home')
      })
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
