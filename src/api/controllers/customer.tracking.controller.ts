import { NextFunction } from 'express'
import { sendResponse } from 'src/helpers/response'
import { AdvancedCondition, CustomRequest } from 'src/types/api.types'
import { LoginPayload } from 'src/types/session.types'
import CustomerTrackingService from '../services/customer.tracking.service'
import { Response } from 'express'

const customerTrackingService = new CustomerTrackingService()

export const loginCustomer = async (
  req: CustomRequest<LoginPayload>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await customerTrackingService.login(req.body)

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const getTrackedRepairOrders = async (
  req: CustomRequest<AdvancedCondition[]>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { customer_id } = req.params
    const { page, size } = req.query
    const result = await customerTrackingService.getRepairOrders(
      req.body,
      customer_id,
      { page, size }
    )

    sendResponse(res, result)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error({ error })
    next(error)
  }
}
