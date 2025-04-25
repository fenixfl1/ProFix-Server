import { NextFunction, Response } from 'express'
import { CustomRequest } from 'src/types/api.types'
import EmailService from '../services/email/email.service'
import { sendResponse } from 'src/helpers/response'
import { publishEmailToQueue } from '../services/email/email-producer.service'

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
    next(error)
  }
}

export const sendWelcomeEmail = async (
  req: CustomRequest<any>,
  res: Response
) => {
  const { to, name, record } = req.body

  const message = {
    to,
    subject: 'Bienvenido a la plataforma',
    text: `Hola ${name}, gracias por registrarte.`,
    templateName: 'welcome',
    record: {
      name,
      ...record,
      url: process.env.ADMIN_APP_URL,
    },
  }

  try {
    await publishEmailToQueue(message)
    res.status(200).json({ message: 'Email encolado correctamente' })
  } catch (error) {
    console.error('❌ Error al encolar email:', error)
    res.status(500).json({ message: 'Error al enviar el email' })
  }
}
