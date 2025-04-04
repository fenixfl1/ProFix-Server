import { AdvancedCondition, CustomRequest } from 'src/types/api.types'
import {
  CreateProductDetailPayload,
  CreateProductHeaderPayload,
  ProductsService,
} from '../services/products.service'
import { NextFunction, Response } from 'express'
import { sendResponse } from 'src/helpers/response'
import { ProductDetail } from 'src/entities/ProductDetail'
import { Category } from 'src/entities/Category'

const productService = new ProductsService()

export const createProductHeader = async (
  req: CustomRequest<CreateProductHeaderPayload>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await productService.createProductHeader(
      req.body,
      req.sessionInfo
    )

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const updateProductHeader = async (
  req: CustomRequest<CreateProductHeaderPayload>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await productService.updateProductHeader(
      req.body,
      req.sessionInfo
    )

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const createProductDetail = async (
  req: CustomRequest<CreateProductDetailPayload>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await productService.createProductDetail(
      req.body,
      req.sessionInfo
    )

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const updateProductDetail = async (
  req: CustomRequest<ProductDetail>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await productService.updateProductDetail(
      req.body,
      req.sessionInfo
    )

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const createCategory = async (
  req: CustomRequest<Category>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await productService.createCategory(
      req.body,
      req.sessionInfo
    )

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const getCategories = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await productService.getCategories()

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const getProductHeaders = async (
  req: CustomRequest<AdvancedCondition[]>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, size } = req.query
    const result = await productService.getProductHeaders(req.body, {
      page,
      size,
    })

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}

export const getProducts = async (
  req: CustomRequest<AdvancedCondition[]>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, size } = req.query
    const result = await productService.getProducts(req.body, { page, size })

    sendResponse(res, result)
  } catch (error) {
    next(error)
  }
}
