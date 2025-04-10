export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_PORT: number
      JWT_SECRET: string
      DB_HOST: string
      DB_PORT: string
      DB_USER: string
      DB_PASS: string
      DB_NAME: string
      SMTP_HOST: string
      NODEMAILER_PORT: number
      NODEMAILER_USER: string
      NODEMAILER_PASS: string
      CLIENT_ID: string
      CLIENT_SECRET: string
      REDIRECT_URI: string
      REFRESH_TOKEN: string
    }
  }
  namespace Express {
    interface Request {
      sessionInfo: any
    }
  }
}
