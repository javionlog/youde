import { guardController } from '@/modules/shared/controller'
import { auth } from '../service'

const app = guardController.mount(auth.handler)

export default app
