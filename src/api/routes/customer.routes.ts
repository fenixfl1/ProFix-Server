import { Router } from 'express'
import validateSchema from '../middlewares/validation.middleware'
import {
  createCustomer,
  getCustomerById,
  getCustomers,
  updateCustomer,
} from '../controllers/customer.controller'
import {
  createCustomerSchema,
  updateCustomerSchema,
} from 'src/validations/customer.schema'
import {
  PATH_CRATE_CUSTOMER,
  PATH_UPDATE_CUSTOMER,
  PATH_GET_CUSTOMERS,
  PATH_GET_ONE_CUSTOMER,
} from 'src/constants/routes'

const customerRouter = Router()

customerRouter.post(
  PATH_CRATE_CUSTOMER,
  validateSchema(createCustomerSchema),
  createCustomer
)
customerRouter.put(
  PATH_UPDATE_CUSTOMER,
  validateSchema(updateCustomerSchema),
  updateCustomer
)
customerRouter.post(PATH_GET_CUSTOMERS, getCustomers)
customerRouter.get(PATH_GET_ONE_CUSTOMER, getCustomerById)

export default customerRouter
