import { config } from 'dotenv'
import { connectDatabase } from '../config/database/ormconfig'
import createExpressApp from 'src/config/server'
// import type { VercelRequest, VercelResponse } from '@vercel/node'

// Cargar variables de entorno
config()
// Realiza la conexión a la base de datos y crea la aplicación Express en una función asíncrona autoejecutable.
// Nota: Este ejemplo asume que la conexión se puede reutilizar en llamadas subsiguientes.
let app: ReturnType<typeof createExpressApp>
;(async () => {
  await connectDatabase()
  app = createExpressApp()
})()

// Exporta la función handler para Vercel
export default async function handler(req: any, res: any) {
  return app(req, res)
}
