import { guardController } from '@/global/controllers'
import { auth } from '../services'

const app = guardController.mount(auth.handler)

export default app
