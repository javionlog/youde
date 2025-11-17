type MethodType = 'nolimit' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options'

export const PORTAL_SKIP_AUTH_ROUTES = [
  {
    url: '/portal/user/sign-in',
    method: 'nolimit'
  }
] satisfies {
  url: string
  method: MethodType
}[]

export const ADMIN_SKIP_AUTH_ROUTES = [
  {
    url: '/admin/user/sign-in',
    method: 'nolimit'
  }
] satisfies {
  url: string
  method: MethodType
}[]

export const SYSTEM_OPERATOR = 'system'

export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8

export const PORTAL_SESSION_MAX_AGE = 60 * 60 * 8
