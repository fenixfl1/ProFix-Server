// src/api/index.ts
import { config } from 'dotenv'
import { initOracleClient } from 'oracledb'
import createExpressApp from '../config/server'
import { connectDatabase } from '../config/database/ormconfig'
import type { VercelRequest, VercelResponse } from '@vercel/node'

// Cargar variables de entorno
config()

// Inicializar Oracle Client si está configurado
if (process.env.ORACLE_INSTANT_CLIENT_ROUTE) {
  initOracleClient({ libDir: process.env.ORACLE_INSTANT_CLIENT_ROUTE })
}

// Realiza la conexión a la base de datos.
// Nota: Este ejemplo asume que la conexión se puede reutilizar en llamadas subsiguientes.
await connectDatabase()

// Crea la aplicación Express
const app = createExpressApp()

// Exporta la función handler para Vercel
export default async function handler(req: any, res: any) {
  return app(req, res)
}
