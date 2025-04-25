import { Router } from 'express'
import userRouter, { publicUserRouter } from './user.routes'
import authMiddleware from '../middlewares/auth.middleware'
import roleRouter from './role.routes'
import menuOptionRouter from './menu-option.routes'
import customerRouter from './customer.routes'
import deviceRouters from './repair-order.routes'
import productRouter from './product.routes'
import emailRouter from './email.routes'
import customerPublicRouter from './customer.public.routes'
import customerTrackingRouter from './customer.tracking.routes'
import authCustomerMiddleware from '../middlewares/auth-customers.middleware'
import dashboardRouter from './dashboard.route'

const publicRoutes = [publicUserRouter, emailRouter, customerPublicRouter]
const privateRoutes = [
  userRouter,
  roleRouter,
  menuOptionRouter,
  customerRouter,
  deviceRouters,
  productRouter,
  dashboardRouter,
]

const routes = Router()
const publicRouter = Router()
const privateRouter = Router()

privateRouter.use(authMiddleware)

routes.use('/tracking', authCustomerMiddleware, customerTrackingRouter)

privateRoutes.forEach((route) => {
  privateRouter.use(route)
})

publicRoutes.forEach((route) => {
  publicRouter.use(route)
})

routes.use([publicRouter, privateRouter])

export default routes
