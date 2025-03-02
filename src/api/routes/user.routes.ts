import { RequestHandler, Router } from 'express'
import login, {
  changePassword,
  getUserByUsername,
  getUserList,
  registerUser,
  updateUser,
} from '../../api/controllers/user.controller'
import {
  changePasswordSchema,
  createUserSchema,
  loginSchema,
  updateUserSchema,
} from '../../validations/user.schemas'
import {
  PATH_GET_USER_BY_USERNAME,
  PATH_LOGIN,
  PATH_REGISTER_USER,
  PATH_GET_USER_LIST,
  PATH_UPDATE_USER,
  PATH_CHANGE_PASSWORD,
} from '../../constants/routes'
import validateSchema from '../middlewares/validation.middleware'
import { queryParamsSchema } from '../../validations/query-schemas'

export const publicUserRouter = Router()

const userRouter = Router()

publicUserRouter.post(PATH_LOGIN, validateSchema(loginSchema), login)

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
