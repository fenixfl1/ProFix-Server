import { objectsKeyToUpperCase } from '../../helpers/objects-key-to-upper'
import { NextFunction, Request, Response } from 'express'

export const upperCaseKeysMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const originalSend = res.send

  res.send = function (body) {
    // Convierte el cuerpo de la respuesta a un objeto si es necesario
    let responseBody = body

    // Si el cuerpo de la respuesta es un objeto JSON, conviértelo a mayúsculas
    try {
      responseBody = JSON.parse(body)
      responseBody = objectsKeyToUpperCase(responseBody)
    } catch (error) {
      // Si no es un JSON válido, solo envía el cuerpo original
    }

    // Llama al método original send con el cuerpo modificado
    return originalSend.call(this, JSON.stringify(responseBody))
  }

  next()
}
