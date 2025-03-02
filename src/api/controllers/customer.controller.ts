import { NextFunction, Response } from 'express'
import { CustomRequest } from 'src/types/api.types'
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
    const result = await customerService.create(req.body)

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}
