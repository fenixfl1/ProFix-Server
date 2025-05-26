import { Router } from 'express'
import {
  PATH_CREATE_REPAIR_ORDER,
  PATH_UPDATE_ORDER_REPAIR,
  PATH_GET_REPAIR_ORDERS,
  PATH_GET_PHONE_BRANDS,
  PATH_GET_REPAIR_ORDER_HISTORY,
  PATH_CHANGE_ORDER_STATUS,
  PATH_GET_ORDER_RECEIPT,
} from '../../constants/routes'
import {
  createRepairOrder,
  getRepairOrderHistory,
  getPhoneBrands,
  getRepairOrders,
  updateRepairOrder,
  changeOrderState,
  getOrderReceipt,
} from '../controllers/repair-order.controller'
import validateSchema from '../middlewares/validation.middleware'
import {
  changeOrderStatusSchema,
  repairOrderSchema,
  updateRepairOrderSchema,
} from 'src/validations/repair-order.schema'

const repairOrderRouter = Router() as any

repairOrderRouter.post(
  PATH_CREATE_REPAIR_ORDER,
  validateSchema(repairOrderSchema),
  createRepairOrder
)
repairOrderRouter.get(PATH_GET_ORDER_RECEIPT, getOrderReceipt)
repairOrderRouter.get(PATH_GET_PHONE_BRANDS, getPhoneBrands)
repairOrderRouter.post(PATH_GET_REPAIR_ORDERS, getRepairOrders)
repairOrderRouter.put(
  PATH_UPDATE_ORDER_REPAIR,
  validateSchema(updateRepairOrderSchema),
  updateRepairOrder
)
repairOrderRouter.post(PATH_GET_REPAIR_ORDER_HISTORY, getRepairOrderHistory)
repairOrderRouter.put(
  PATH_CHANGE_ORDER_STATUS,
  validateSchema(changeOrderStatusSchema),
  changeOrderState
)

export default repairOrderRouter
