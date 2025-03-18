import { NextFunction, Response } from 'express'
import { AdvancedCondition, CustomRequest } from 'src/types/api.types'
import { CustomerService } from '../services/customer.service'
import { Customer } from 'src/entities/Customer'
import { sendResponse } from 'src/helpers/response'

const customerService = new CustomerService()

export const createCustomer = async (
  req: CustomRequest<Customer>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await customerService.create(req.body, req.sessionInfo)

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const updateCustomer = async (
  req: CustomRequest<Customer>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await customerService.update(req.body, req.sessionInfo)

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const getCustomers = async (
  req: CustomRequest<AdvancedCondition[]>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, size } = req.query
    const result = await customerService.getCustomers(req.body, { page, size })

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const getCustomerById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { customer_id } = req.params

    const result = await customerService.getCustomerById(Number(customer_id))

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}
