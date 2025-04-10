import { NextFunction, Response } from 'express'
import { HTTP_STATUS_BAD_REQUEST } from '../../constants/status-codes'
import { BaseError } from '../../helpers/error-api'

function errorHandler(
  error: BaseError,
  req: any,
  res: Response,
  next: NextFunction
) {
  res
    .status(error.status ?? HTTP_STATUS_BAD_REQUEST)
    .json({ error: error.error, message: error.message })
}

export default errorHandler
