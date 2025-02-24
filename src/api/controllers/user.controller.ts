import { INVALID_CREDENTIALS_ERROR } from '@src/constants/error-types'
import { INVALID_LOGIN_CREDENTIAL_ERROR_MESSAGE } from '@src/constants/messages'
import { throwError } from '@src/helpers/error-api'
import { sendResponse } from '@src/helpers/response'
import { AdvancedCondition, CustomRequest } from '@src/types/api.types'
import { LoginPayload } from '@src/types/session.types'
import { NextFunction, Response } from 'express'
import {
  CreateUserPayload,
  UpdateUserPayload,
  UserService,
} from '../services/user.service'
import { HTTP_STATUS_CREATED } from '@src/constants/status-codes'

const userService = new UserService()

export const registerUser = async (
  req: CustomRequest<CreateUserPayload>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await userService.register(req.body)

    sendResponse(res, user, HTTP_STATUS_CREATED)
  } catch (error) {
    next(error)
  }
}

export const updateUser = async (
  req: CustomRequest<UpdateUserPayload>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await userService.update(req.body)

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const getUserByUsername = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username } = req.params
    const user = await userService.getUserByUsername(username)
    sendResponse(res, user)
  } catch (error) {
    next(error)
  }
}

export const getUserList = async (
  req: CustomRequest<AdvancedCondition[]>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, size } = req.query
    const users = await userService.getUserList(req.body, { page, size })
    sendResponse(res, users)
  } catch (error) {
    next(error)
  }
}

export const login = async (
  req: CustomRequest<LoginPayload>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, password } = req.body

    const data = await userService.login(username, password)

    sendResponse(res, data)
  } catch (e) {
    next(e)
  }
}

export default login
