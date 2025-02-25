import { CustomRequest } from '../../types/api.types'
import {
  CreateMenuOptionPayload,
  MenuOptionService,
} from '../services/menu-options.service'
import { NextFunction, Response } from 'express'
import { sendResponse } from '../../helpers/response'
import { HTTP_STATUS_CREATED } from '../../constants/status-codes'

const menuOptionService = new MenuOptionService()

export const createMenuOption = async (
  req: CustomRequest<CreateMenuOptionPayload>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const option = await menuOptionService.create(req.body)

    sendResponse(res, option, HTTP_STATUS_CREATED)
  } catch (error) {
    next(error)
  }
}

export const getMenuOptions = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username } = req.params

    const result = await menuOptionService.getMenuOptions(username)

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const getAllMenuOptions = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await menuOptionService.getAllMenuOptions()

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}
