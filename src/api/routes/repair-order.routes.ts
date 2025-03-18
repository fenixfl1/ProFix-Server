import { Router } from 'express'
import {
  PATH_CREATE_REPAIR_ORDER,
  PATH_UPDATE_ORDER_REPAIR,
  PATH_GET_REPAIR_ORDERS,
  PATH_GET_ONE_DEVICE,
  PATH_GET_PHONE_BRANDS,
  PATH_GET_REPAIR_ORDER_HISTORY,
} from '../../constants/routes'
import {
  createRepairOrder,
  getRepairOrderHistory,
  getPhoneBrands,
  getRepairOrders,
  updateRepairOrder,
} from '../controllers/repair-order.controller'
import validateSchema from '../middlewares/validation.middleware'
import {
  repairOrderSchema,
  updateRepairOrderSchema,
} from 'src/validations/repair-order.schema'

const repairOrderRouter = Router()

repairOrderRouter.post(
  PATH_CREATE_REPAIR_ORDER,
  validateSchema(repairOrderSchema),
  createRepairOrder
)
repairOrderRouter.get(PATH_GET_PHONE_BRANDS, getPhoneBrands)
repairOrderRouter.post(PATH_GET_REPAIR_ORDERS, getRepairOrders)
repairOrderRouter.post(
  PATH_UPDATE_ORDER_REPAIR,
  validateSchema(updateRepairOrderSchema),
  updateRepairOrder
)
repairOrderRouter.post(PATH_GET_REPAIR_ORDER_HISTORY, getRepairOrderHistory)

export default repairOrderRouter
