import { Request, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { HTTP_STATUS_UNAUTHORIZED } from '../../constants/status-codes'

const authMiddleware = (req: Request, res: any, next: NextFunction) => {
  const token = req.headers.authorization

  if (!token) {
    return res
      .status(HTTP_STATUS_UNAUTHORIZED)
      .json({ message: 'Access denied. No token provided.' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    req['sessionInfo'] = decoded
    next()
  } catch (error) {
    return res
      .status(HTTP_STATUS_UNAUTHORIZED)
      .json({ message: 'Invalid token.' })
  }
}

export default authMiddleware
