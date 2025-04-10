import { NextFunction, Response } from 'express'
import { CustomRequest } from 'src/types/api.types'
import EmailService from '../services/email.service'
import { sendResponse } from 'src/helpers/response'

const mailService = new EmailService()

export const sendEmail = async (
  req: CustomRequest<any>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await mailService.send(req.body)

    sendResponse(res, { data: JSON.stringify(result) })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error({ error })
    next(error)
  }
}
