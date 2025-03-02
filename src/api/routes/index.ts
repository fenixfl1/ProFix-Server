import { Router } from 'express'
import userRouter, { publicUserRouter } from './user.routes'
import authMiddleware from '../middlewares/auth.middleware'
import roleRouter from './role.routes'
import menuOptionRouter from './menu-option.routes'

const publicRoutes = [publicUserRouter]
const privateRoutes = [userRouter, roleRouter, menuOptionRouter]

const routes = Router()
const publicRouter = Router()
const privateRouter = Router()

privateRouter.use(authMiddleware)

privateRoutes.forEach((route) => {
  privateRouter.use(route)
})

publicRoutes.forEach((route) => {
  publicRouter.use(route)
})

routes.use([publicRouter, privateRouter])

export default routes
