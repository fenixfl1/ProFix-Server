import { RequestHandler, Router } from 'express'
import {
  changePassword,
  getUserByUsername,
  getUserList,
  registerUser,
  requestResetPassword,
  resetPassword,
  updateUser,
  login,
} from '../../api/controllers/user.controller'
import {
  changePasswordSchema,
  createUserSchema,
  loginSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
  updateUserSchema,
} from '../../validations/user.schemas'
import {
  PATH_GET_USER_BY_USERNAME,
  PATH_LOGIN,
  PATH_REGISTER_USER,
  PATH_GET_USER_LIST,
  PATH_UPDATE_USER,
  PATH_CHANGE_PASSWORD,
  PATH_REQUEST_RESET_PASSWORD,
  PATH_RESET_PASSWORD,
} from '../../constants/routes'
import validateSchema from '../middlewares/validation.middleware'
import { queryParamsSchema } from '../../validations/query-schemas'

export const publicUserRouter = Router() as any

const userRouter = Router() as any

publicUserRouter.post(PATH_LOGIN, validateSchema(loginSchema), login)
publicUserRouter.post(
  PATH_REQUEST_RESET_PASSWORD,
  validateSchema(requestPasswordResetSchema),
  requestResetPassword
)
publicUserRouter.post(
  PATH_RESET_PASSWORD,
  validateSchema(resetPasswordSchema),
  resetPassword
)

userRouter.post(
  PATH_GET_USER_LIST,
  validateSchema(queryParamsSchema, 'query'),
  getUserList
)
userRouter.get(PATH_GET_USER_BY_USERNAME, getUserByUsername)
userRouter.post(
  PATH_REGISTER_USER,
  validateSchema(createUserSchema),
  registerUser
)
userRouter.put(PATH_UPDATE_USER, validateSchema(updateUserSchema), updateUser)
userRouter.put(
  PATH_CHANGE_PASSWORD,
  validateSchema(changePasswordSchema),
  changePassword
)

export default userRouter
