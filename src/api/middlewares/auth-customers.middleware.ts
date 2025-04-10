import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { HTTP_STATUS_UNAUTHORIZED } from 'src/constants/status-codes'

const authCustomerMiddleware = (req: Request, res: any, next: NextFunction) => {
  const token = req.headers.authorization

  if (!token) {
    return res.status(HTTP_STATUS_UNAUTHORIZED).json({
      message: 'Acceso denegado. Token no proporcionado.',
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    req['sessionInfo'] = decoded
    return next()
  } catch (error) {
    return res.status(HTTP_STATUS_UNAUTHORIZED).json({
      message: 'Token inválido para cliente.',
    })
  }
}

export default authCustomerMiddleware
