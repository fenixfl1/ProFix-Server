import { Router } from 'express'
import validateSchema from '../middlewares/validation.middleware'
import {
  createMenuOption,
  getAllMenuOptions,
  getMenuOptions,
} from '../controllers/menu-option.controller'
import { createMenuOptionSchema } from '@src/validations/menu-option.schema'
import {
  PATH_CREATE_MENU_OPTION,
  PATH_GET_ALL_MENU_OPTIONS,
  PATH_GET_MENU_OPTIONS,
} from '@src/constants/routes'

const menuOptionRouter = Router()

menuOptionRouter.post(
  PATH_CREATE_MENU_OPTION,
  validateSchema(createMenuOptionSchema),
  createMenuOption
)
menuOptionRouter.get(PATH_GET_MENU_OPTIONS, getMenuOptions)
menuOptionRouter.get(PATH_GET_ALL_MENU_OPTIONS, getAllMenuOptions)

export default menuOptionRouter
