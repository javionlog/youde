export const SKIP_AUTH_ROUTES = [
  '/auth/sign-in/social',
  '/auth/sign-in/email',
  '/auth/sign-in/username',
  '/auth/sign-up/email',
  '/admin-user/sign-in'
]

type MethodType = 'nolimit' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options'

export const ADMIN_SKIP_AUTH_ROUTES = [
  {
    url: '/admin-user/sign-in',
    method: 'nolimit'
  }
] satisfies {
  url: string
  method: MethodType
}[]

export const SYSTEM_OPERATOR = 'system'

export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8
