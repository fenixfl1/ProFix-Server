import { Router } from 'express'
import validateSchema from '../middlewares/validation.middleware'
import {
  assignPermissions,
  createRole,
  getAllRoles,
  getRoleList,
} from '../controllers/roles.controller'
import {
  assignPermissionsSchema,
  createRoleSchema,
} from '../../validations/role.schema'
import {
  PATH_ASSIGN_PERMISSION,
  PATH_CREATE_ROLE,
  PATH_GET_ALL_ROLES,
  PATH_GET_ROLES_LIST,
} from '../../constants/routes'

const roleRouter = Router()

roleRouter.post(PATH_CREATE_ROLE, validateSchema(createRoleSchema), createRole)
roleRouter.post(PATH_GET_ROLES_LIST, getRoleList)
roleRouter.get(PATH_GET_ALL_ROLES, getAllRoles)
roleRouter.post(
  PATH_ASSIGN_PERMISSION,
  validateSchema(assignPermissionsSchema),
  assignPermissions
)

export default roleRouter
