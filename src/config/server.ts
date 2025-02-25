import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import routes from '../api/routes'
import errorHandler from '../api/middlewares/error.middleware'
import { SUCCESS_CONSOLE_FONT_COLOR } from '../constants/general'

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

  console.log(
    SUCCESS_CONSOLE_FONT_COLOR,
    ` 🚀 Express app configurada: http://localhost:${process.env.APP_PORT}`
  )

  return app
}

export default createExpressApp
