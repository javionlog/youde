import { baseController } from '@/modules/shared/controller'
import { authInstance } from '../service'

const app = baseController.mount(authInstance.handler)

export default app
