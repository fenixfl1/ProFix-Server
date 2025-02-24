export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      APP_ENV: string
      APP_PORT: string
      ORACLE_INSTANT_CLIENT_ROUTE: string
      TYPEORM_DB_CONNECTION: string
      TYPEORM_DB_SID: string
      TYPEORM_ENTITIES: string
      TYPEORM_ENTITIES_DIR: string
      TYPEORM_DB_HOST: string
      TYPEORM_MIGRATIONS: string
      TYPEORM_MIGRATIONS_DIR: string
      TYPEORM_DB_PASSWORD: string
      TYPEORM_DB_PORT: string
      TYPEORM_DB_USERNAME: string
      INSTANT_CLIENT_LIBRARY: string
      JWT_SECRET: string
      API_VERSION: string
      EXPIRATION_TIME: string
      EXPIRATION_MAGNITUDE: string
    }
  }
  namespace Express {
    interface Request {
      sessionInfo: any
    }
  }
}
