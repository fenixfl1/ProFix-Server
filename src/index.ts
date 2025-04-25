import { config } from 'dotenv'
import { initOracleClient } from 'oracledb'
import initExpressServer from './config/server'
import { connectDatabase } from './config/database/ormconfig'
import { startConsumer } from './api/services/email/email-consumer.service'

const initServer = async (): Promise<void> => {
  config()

  await connectDatabase()
  await startConsumer()

  const app = initExpressServer()

  app.listen(process.env.APP_PORT)
}

initServer()
