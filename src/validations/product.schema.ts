import Joi from 'joi'

export const createProductSchema = Joi.object({
  product_header_id: Joi.number().integer().required(),
  details: Joi.array()
    .items(
      Joi.object({
        model: Joi.string().required(),
        brand: Joi.string().required(),
        price: Joi.number().positive().required(),
        stock: Joi.number().integer().min(0).required(),
        supplier: Joi.string().optional(),
        condition: Joi.string().valid('NO', 'UO', 'NR', 'UR').required(),
      })
    )
    .min(1)
    .required(),
})

export const updateProductDetailSchema = Joi.object({
  product_detail_id: Joi.number().integer().required(),
  model: Joi.string().optional(),
  brand: Joi.string().optional(),
  price: Joi.number().positive().optional(),
  stock: Joi.number().integer().min(0).optional(),
  supplier: Joi.string().optional(),
  state: Joi.string().valid('A', 'I').optional(),
  condition: Joi.string().valid('NO', 'UO', 'NR', 'UR').optional(),
})

export const productHeaderSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  category_id: Joi.number().integer().required(),
})

export const updateProductHeaderSchema = Joi.object({
  product_id: Joi.number().required(),
  state: Joi.string().valid('A', 'I').required(),
  category_id: Joi.number().integer().optional(),
  name: Joi.string().optional(),
  description: Joi.string().optional(),
})

export const createCategorySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(null, '').optional(),
})
