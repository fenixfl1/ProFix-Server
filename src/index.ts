import { config } from 'dotenv'
import { initOracleClient } from 'oracledb'
import initExpressServer from './config/server'
import { connectDatabase } from './config/database/ormconfig'

const initServer = async (): Promise<void> => {
  config()

  if (process.env.ORACLE_INSTANT_CLIENT_ROUTE) {
    initOracleClient({ libDir: process.env.ORACLE_INSTANT_CLIENT_ROUTE })
  }

  await connectDatabase()
  initExpressServer()
}

initServer()
