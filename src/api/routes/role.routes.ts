import { Router } from 'express'
import validateSchema from '../middlewares/validation.middleware'
import {
  assignPermissions,
  createRole,
  getAllRoles,
  getRoleById,
  getRoleList,
  updateRole,
} from '../controllers/roles.controller'
import {
  assignPermissionsSchema,
  createRoleSchema,
  updateRoleSchema,
} from '../../validations/role.schema'
import {
  PATH_ASSIGN_PERMISSION,
  PATH_CREATE_ROLE,
  PATH_GET_ALL_ROLES,
  PATH_GET_ONE_ROLE,
  PATH_GET_ROLES_LIST,
  PATH_UPDATE_ROLE,
} from '../../constants/routes'

const roleRouter = Router() as any

roleRouter.post(PATH_CREATE_ROLE, validateSchema(createRoleSchema), createRole)
roleRouter.put(PATH_UPDATE_ROLE, validateSchema(updateRoleSchema), updateRole)
roleRouter.post(PATH_GET_ROLES_LIST, getRoleList)
roleRouter.get(PATH_GET_ALL_ROLES, getAllRoles)
roleRouter.get(PATH_GET_ONE_ROLE, getRoleById)
roleRouter.post(
  PATH_ASSIGN_PERMISSION,
  validateSchema(assignPermissionsSchema),
  assignPermissions
)

export default roleRouter
