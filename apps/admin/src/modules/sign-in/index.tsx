import { Desktop1Icon, LockOnIcon } from 'tdesign-icons-react'
import type { FormProps, FormRules } from 'tdesign-react'
import type { PostAuthSignInUsernameData } from '@/global/api'
import { postAuthSignInUsername } from '@/global/api'

const { FormItem } = Form

const initialData = {
  username: 'admin',
  password: '12345678'
} satisfies PostAuthSignInUsernameData['body']

export default () => {
  const user = useUserStore(state => state.user)
  const [formData] = useState(initialData)
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { t } = useTranslation()

  if (user) {
    return <Navigate to='/' replace />
  }

  const rules = {
    username: getRequiredRules({ form }),
    password: getRequiredRules({ form })
  } satisfies FormRules<PostAuthSignInUsernameData['body']>

  const onSubmit: FormProps['onSubmit'] = async e => {
    if (e.validateResult === true) {
      const params = form.getFieldsValue(true) as typeof initialData
      const resData = await postAuthSignInUsername({ body: params }).then(r => r.data!)
      useUserStore.setState({ user: resData.user })
      const searchParams = new URLSearchParams(window.location.search)
      const redirectPath = searchParams.get('redirect') ?? '/home'
      navigate(redirectPath)
    }
  }

  return (
    <div className='grid content-center h-full'>
      <div className='w-full max-w-lg mx-auto p-4 '>
        <div className='border-1 border-(--td-component-border) rounded p-4 bg-(--td-bg-color-container)'>
          <div className='flex items-center justify-end gap-2 mb-4'>
            <LangSelect />
            <ThemeSelect />
          </div>
          <Form form={form} labelWidth={0} rules={rules} onSubmit={onSubmit}>
            <FormItem name='username' initialData={formData.username}>
              <Input
                prefixIcon={<Desktop1Icon />}
                placeholder={t('message.usernameRequired')}
                clearable
              />
            </FormItem>
            <FormItem name='password' initialData={formData.password}>
              <Input
                prefixIcon={<LockOnIcon />}
                type='password'
                placeholder={t('message.passwordRequired')}
                clearable
              />
            </FormItem>
            <FormItem>
              <Button theme='primary' type='submit' block>
                {t('action.signIn')}
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
  )
}
