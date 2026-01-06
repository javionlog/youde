import { Desktop1Icon, LockOnIcon } from 'tdesign-icons-react'
import type { FormRules } from 'tdesign-react'
import type { PostAdminUserSignInData } from '@/global/api'
import { postAdminUserSignIn } from '@/global/api'

type FormProps = Parameters<typeof GlForm>[0]

const initialData = {
  username: 'admin',
  password: 'Admin888@@'
} satisfies PostAdminUserSignInData['body']

export default () => {
  const [formData] = useState(initialData)
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)

  const rules = {
    username: getRequiredRules(),
    password: getRequiredRules()
  } satisfies FormRules<PostAdminUserSignInData['body']>

  const items = [
    {
      formItem: {
        name: 'username',
        children: (
          <GlInput prefixIcon={<Desktop1Icon />} placeholder={t('message.usernameRequired')} />
        )
      }
    },
    {
      formItem: {
        name: 'password',
        children: (
          <GlInput
            prefixIcon={<LockOnIcon />}
            type='password'
            placeholder={t('message.passwordRequired')}
          />
        )
      }
    },
    {
      formItem: {
        name: 'submit',
        children: (
          <Button loading={loading} theme='primary' type='submit' block>
            {t('action.signIn')}
          </Button>
        )
      }
    }
  ] satisfies FormProps['items']

  const onSubmit: FormProps['onSubmit'] = async ({ validateResult }) => {
    if (validateResult === true) {
      try {
        setLoading(true)
        const params = form.getFieldsValue(true) as typeof initialData
        const resData = await postAdminUserSignIn({ body: params }).then(r => r.data!)
        useUserStore.setState({ user: resData.user })
        useResourceStore.setState({ resourceTree: resData.resourceTree })
      } finally {
        setLoading(false)
      }
      const searchParams = new URLSearchParams(window.location.search)
      const redirectPath = searchParams.get('redirect') ?? '/home'
      navigate(redirectPath)
    }
  }

  return (
    <div className='grid h-dvh content-center'>
      <div className='mx-auto w-full max-w-lg p-4 '>
        <div className='rounded border-(--td-component-border) border-1 bg-(--td-bg-color-container) p-4'>
          <div className='mb-4 flex items-center justify-end gap-2'>
            <GlLangSelect />
            <GlThemeSelect />
          </div>
          <GlForm
            form={form}
            rules={rules}
            items={items}
            labelWidth={0}
            initialData={formData}
            labelEllipsis={false}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </div>
  )
}
