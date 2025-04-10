import { DataSource } from 'typeorm'
import dotenv from 'dotenv'
import {
  SUCCESS_CONSOLE_FONT_COLOR,
  FAIL_CONSOLE_FONT_COLOR,
} from '../../constants/general'

dotenv.config()

const port = process.env.DB_PORT
const host = process.env.DB_HOST

export const AppDataSource = new DataSource({
  type: 'mysql',
  host,
  port: Number(port),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: ['./src/entities/**/*.ts'],
  migrations: ['./src/config/database/migrations/**/*.ts'],
  subscribers: ['./src/config/database/subscribers/**/*.ts'],
})

export const connectDatabase = async () => {
  try {
    await AppDataSource.initialize()

    console.info(
      SUCCESS_CONSOLE_FONT_COLOR,
      ` ✨ database connection established successfully at: http://${host}:${port}. `
    )
  } catch (error) {
    console.error(
      FAIL_CONSOLE_FONT_COLOR,
      ` 💥 Unable to connect to database server at:  http://${host}:${port}`,
      error
    )
  }
  return AppDataSource
}
