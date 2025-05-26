import { Router } from 'express'
import validateSchema from '../middlewares/validation.middleware'
import {
  createProductSchema,
  updateProductDetailSchema,
  productHeaderSchema,
  createCategorySchema,
  updateProductHeaderSchema,
} from 'src/validations/product.schema'
import {
  PATH_CREATE_PRODUCT_HEADER,
  PATH_UPDATE_PRODUCT_HEADER,
  PATH_CREATE_PRODUCT_DETAIL,
  PATH_UPDATE_PRODUCT_DETAIL,
  PATH_GET_PRODUCT_HEADERS,
  PATH_GET_PRODUCTS,
  PATH_GET_CATEGORIES,
  PATH_CREATE_CATEGORY,
} from 'src/constants/routes'
import {
  createProductHeader,
  updateProductHeader,
  createProductDetail,
  updateProductDetail,
  createCategory,
  getCategories,
  getProductHeaders,
  getProducts,
} from 'src/api/controllers/product.controller'

const productRouter = Router() as any

productRouter.post(
  PATH_CREATE_PRODUCT_HEADER,
  validateSchema(productHeaderSchema),
  createProductHeader
)
productRouter.put(
  PATH_UPDATE_PRODUCT_HEADER,
  validateSchema(updateProductHeaderSchema),
  updateProductHeader
)

productRouter.post(
  PATH_CREATE_PRODUCT_DETAIL,
  validateSchema(createProductSchema),
  createProductDetail
)
productRouter.put(
  PATH_UPDATE_PRODUCT_DETAIL,
  validateSchema(updateProductDetailSchema),
  updateProductDetail
)

productRouter.post(
  PATH_CREATE_CATEGORY,
  validateSchema(createCategorySchema),
  createCategory
)
productRouter.get(PATH_GET_CATEGORIES, getCategories)

productRouter.post(PATH_GET_PRODUCT_HEADERS, getProductHeaders)
productRouter.post(PATH_GET_PRODUCTS, getProducts)

export default productRouter
