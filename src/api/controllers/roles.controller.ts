import { AdvancedCondition, CustomRequest } from '../../types/api.types'
import {
  AssignPermissionPayload,
  CreateRolePayload,
  RoleServices,
  UpdateRolePayload,
} from '../services/roles.service'
import { NextFunction, Response } from 'express'
import { sendResponse } from '../../helpers/response'
import { HTTP_STATUS_CREATED } from '../../constants/status-codes'

const roleService = new RoleServices()

export const createRole = async (
  req: CustomRequest<CreateRolePayload>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const role = await roleService.create(req.body)

    sendResponse(res, role, HTTP_STATUS_CREATED)
  } catch (error) {
    next(error)
  }
}

export const getRoleList = async (
  req: CustomRequest<AdvancedCondition[]>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await roleService.getRoleList(req.body, req.query)

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const getAllRoles = async (
  req: CustomRequest<AdvancedCondition[]>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await roleService.getAllRoles()

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const assignPermissions = async (
  req: CustomRequest<AssignPermissionPayload>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await roleService.assign_permission(req.body)

    sendResponse(res, result, HTTP_STATUS_CREATED)
  } catch (error) {
    next(error)
  }
}

export const updateRole = async (
  req: CustomRequest<UpdateRolePayload>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await roleService.update(req.sessionInfo, req.body)

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const getRoleById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await roleService.getRoleById(Number(req.params.role_id))

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}
