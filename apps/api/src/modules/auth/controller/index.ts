import { baseController } from '@/modules/shared/controller'
import { auth } from '../service'

const app = baseController.mount(auth.handler)

export default app
