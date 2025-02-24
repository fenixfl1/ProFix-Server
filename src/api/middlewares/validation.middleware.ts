import Joi, { ValidationError } from 'joi'
import { NextFunction, Request, Response } from 'express'
import { PayloadValidationError } from '@src/helpers/error-api'
import { ParamsLocation } from '@src/types/api.types'

const validateSchema = (
  schema: Joi.ObjectSchema,
  location: ParamsLocation = 'body'
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const loc = location

    const { value, error } = schema.validate(req[loc])

    if (!error) {
      req[loc] = value
      return next()
    }

    const { details } = error
    const message = details.map((e) => e.message).join(',')

    PayloadValidationError(message)
  }
}

export default validateSchema
