import { Router } from 'express'
import validateSchema from '../middlewares/validation.middleware'
import { getTrackedRepairOrders } from '../controllers/customer.tracking.controller'
import { PATH_GET_CUSTOMER_TRACKING_ORDER } from 'src/constants/routes'

const customerTrackingRouter = Router() as any

customerTrackingRouter.post(
  PATH_GET_CUSTOMER_TRACKING_ORDER,
  getTrackedRepairOrders
)

export default customerTrackingRouter
