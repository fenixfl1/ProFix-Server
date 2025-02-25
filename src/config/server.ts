import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import { SUCCESS_CONSOLE_FONT_COLOR } from '@src/constants/general'
import routes from '@src/api/routes'
import errorHandler from '@src/api/middlewares/error.middleware'

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST',
  credentials: false,
}

const createExpressApp = (): express.Express => {
  const app = express()

  app.use(cors(corsOptions))
  app.use(cookieParser())
  app.use(bodyParser.json({ limit: '50mb' }))
  app.use(express.urlencoded({ extended: true }))
  app.use(routes)
  app.use(errorHandler)

  console.log(SUCCESS_CONSOLE_FONT_COLOR, ` 🚀 Express app configurada`)

  return app
}

export default createExpressApp
