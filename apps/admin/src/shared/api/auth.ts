import http from '@/shared/utils/http'

const prefix = 'auth'

type SignInParams = {
  username: string
  password: string
  remeberMe?: boolean
}

export type SignInResponse = {
  token: string
  user: {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image: string
    createdAt: string
    updatedAt: string
    username: string
    displayUsername: string
  }
}

export const signIn = (json: SignInParams) => {
  return http.post(`${prefix}/sign-in/username`, { json }).json<SignInResponse>()
}

export type GetSessionResponse = {
  session: {
    id: string
    expiresAt: string
    token: string
    createdAt: string
    updatedAt: string
    ipAddress: string
    userAgent: string
    userId: string
  }
  user: {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image: string
    createdAt: string
    updatedAt: string
    username: string
    displayUsername: string
  }
} | null
export const getSession = () => {
  return http.get(`${prefix}/get-session`).json<GetSessionResponse>()
}
export const signOut = () => {
  return http.post(`${prefix}/sign-out`, { json: {} }).json()
}
