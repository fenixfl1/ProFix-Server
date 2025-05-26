import { Router } from 'express'

import validateSchema from '../middlewares/validation.middleware'
import { PATH_LOGIN_CUSTOMER } from 'src/constants/routes'
import { loginSchema } from 'src/validations/user.schemas'
import { loginCustomer } from '../controllers/customer.tracking.controller'

const customerPublicRouter = Router() as any

customerPublicRouter.post(
  PATH_LOGIN_CUSTOMER,
  validateSchema(loginSchema),
  loginCustomer
)

export default customerPublicRouter
