import { NextFunction, Response } from 'express'
import { AdvancedCondition, CustomRequest } from 'src/types/api.types'
import {
  ChangeStatePayload,
  RepairOrderPayload,
  RepairOrderService,
  UpdateOrderPayload,
} from '../services/repair-order.service'
import { sendResponse } from 'src/helpers/response'

const repairOrderService = new RepairOrderService()

export const createRepairOrder = async (
  req: CustomRequest<RepairOrderPayload>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await repairOrderService.create(req.body, req.sessionInfo)

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const updateRepairOrder = async (
  req: CustomRequest<UpdateOrderPayload>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await repairOrderService.update(req.body, req.sessionInfo)

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const getRepairOrders = async (
  req: CustomRequest<AdvancedCondition[]>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, size } = req.query
    const result = await repairOrderService.getRepairOrders(req.body, {
      page,
      size,
    })

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const getPhoneBrands = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await repairOrderService.getProneBrands()

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const getRepairOrderHistory = async (
  req: CustomRequest<AdvancedCondition[]>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { size, page } = req.query
    const result = await repairOrderService.getHistory(req.body, { size, page })

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const changeOrderState = async (
  req: CustomRequest<ChangeStatePayload>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await repairOrderService.changeState(
      req.body,
      req.sessionInfo
    )

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const getOrderReceipt = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { repair_order_id } = req.query

    const result = await repairOrderService.getReceipt(
      repair_order_id,
      req.sessionInfo
    )

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}
