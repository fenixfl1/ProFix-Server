import { Router } from 'express'
import {
  getAverageRepairTimeInDays,
  getMonthlyIncome,
  getMostCommonDevices,
  getNewAndRecurrentCustomers,
  getNewCustomersPerMonth,
  getRepairOrderByMonth,
  getRepairOrdersByStatus,
} from '../controllers/dashboard.controller'
import {
  PATH_GET_AVERAGE_REPAIR_TIME_DAYS,
  PATH_GET_MONTHLY_INCOME,
  PATH_GET_MOST_COMMON_DEVICES,
  PATH_GET_NEW_CUSTOMER_PER_MONTH,
  PATH_GET_RECURRENT_CUSTOMERS_VS_NEW_CUSTOMERS,
  PATH_GET_REPAIR_ORDERS_BY_MONTH,
  PATH_GET_REPAIR_ORDERS_BY_STATUS,
} from 'src/constants/routes'

const dashboardRouter = Router()

dashboardRouter.get(PATH_GET_REPAIR_ORDERS_BY_STATUS, getRepairOrdersByStatus)
dashboardRouter.get(PATH_GET_REPAIR_ORDERS_BY_MONTH, getRepairOrderByMonth)
dashboardRouter.get(PATH_GET_MONTHLY_INCOME, getMonthlyIncome)
dashboardRouter.get(PATH_GET_MOST_COMMON_DEVICES, getMostCommonDevices)
dashboardRouter.get(PATH_GET_NEW_CUSTOMER_PER_MONTH, getNewCustomersPerMonth)
dashboardRouter.get(
  PATH_GET_RECURRENT_CUSTOMERS_VS_NEW_CUSTOMERS,
  getNewAndRecurrentCustomers
)
dashboardRouter.get(
  PATH_GET_AVERAGE_REPAIR_TIME_DAYS,
  getAverageRepairTimeInDays
)

export default dashboardRouter
