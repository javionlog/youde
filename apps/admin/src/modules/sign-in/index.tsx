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
  const [formData] = useState(initialData)
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { t } = useTranslation()

  const rules = {
    username: getRequiredRules({ form }),
    password: getRequiredRules({ form })
  } satisfies FormRules<PostAuthSignInUsernameData['body']>

  const onSubmit: FormProps['onSubmit'] = async ({ validateResult }) => {
    if (validateResult === true) {
      const params = form.getFieldsValue(true) as typeof initialData
      const resData = await postAuthSignInUsername({ body: params }).then(r => r.data!)
      useUserStore.setState({ user: resData.user })
      const searchParams = new URLSearchParams(window.location.search)
      const redirectPath = searchParams.get('redirect') ?? '/home'
      navigate(redirectPath)
    }
  }

  return (
    <div className='grid h-full content-center'>
      <div className='mx-auto w-full max-w-lg p-4 '>
        <div className='rounded border-(--td-component-border) border-1 bg-(--td-bg-color-container) p-4'>
          <div className='mb-4 flex items-center justify-end gap-2'>
            <LangSelect />
            <ThemeSelect />
          </div>
          <Form form={form} labelWidth={0} rules={rules} initialData={formData} onSubmit={onSubmit}>
            <FormItem name='username'>
              <Input
                prefixIcon={<Desktop1Icon />}
                placeholder={t('message.usernameRequired')}
                clearable
              />
            </FormItem>
            <FormItem name='password'>
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
