import { guardController } from '@/modules/shared/controllers'
import { auth } from '../services'

const app = guardController.mount(auth.handler)

export default app
