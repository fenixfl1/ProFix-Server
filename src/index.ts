import { config } from 'dotenv'
import { initOracleClient } from 'oracledb'
import initExpressServer from './config/server'
import { connectDatabase } from './config/database/ormconfig'

const initServer = async (): Promise<void> => {
  config()

  await connectDatabase()

  const app = initExpressServer()

  app.listen(process.env.APP_PORT)
}

initServer()
