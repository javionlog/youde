import type { User } from 'better-auth'

export type UserSpec = User & { username?: string }
