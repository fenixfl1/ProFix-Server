import { CustomRequest } from 'src/types/api.types'
import DashboardService from '../services/dashboard.service'
import { NextFunction, Response } from 'express'
import { sendResponse } from 'src/helpers/response'

const dashboardService = new DashboardService()

export const getRepairOrdersByStatus = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await dashboardService.getRepairOrderByStatus()

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const getRepairOrderByMonth = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await dashboardService.getRepairOrderByMonth()

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const getMonthlyIncome = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await dashboardService.getMonthlyIncome()

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const getMostCommonDevices = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await dashboardService.getMostCommonDevices()

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const getNewCustomersPerMonth = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await dashboardService.getNewCustomersPerMonth()

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const getAverageRepairTimeInDays = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await dashboardService.getAverageRepairTimeInDays()

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const getNewAndRecurrentCustomers = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await dashboardService.getNewAndRecurrentCustomers()

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}
