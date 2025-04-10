import { Router } from 'express'
import { sendEmail } from '../controllers/email.controller'

const emailRouter = Router()

emailRouter.post('/send_mail', sendEmail)

export default emailRouter
