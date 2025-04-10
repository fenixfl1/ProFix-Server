import Joi from 'joi'

export const repairOrderSchema = Joi.object({
  customer_id: Joi.number().integer().required(),
  devices: Joi.array()
    .items(
      Joi.object({
        brand_id: Joi.number().integer().required(),
        model: Joi.string().required(),
        imei: Joi.string()
          .pattern(/^\d{15}$/)
          .required(),
        color: Joi.string().optional(),
        physical_condition: Joi.string().required(),
        reported_issue: Joi.string().required(),
        diagnosis: Joi.string().required(),
        estimated_cost: Joi.number().positive().optional(),
        advanced_payment: Joi.number().positive().optional(),
        delivery_date: Joi.date().optional(),
      })
    )
    .min(1)
    .required(),
})

export const updateRepairOrderSchema = Joi.object({
  repair_order_id: Joi.number().integer().required(),
  reported_issue: Joi.string().trim().min(1).optional(),
  diagnosis: Joi.string().trim().allow(null, ''),
  status: Joi.string().valid('P', 'I', 'R', 'N').optional(),
  estimated_cost: Joi.number().precision(2).allow(null, ''),
  advanced_payment: Joi.number().precision(2).allow(null, ''),
  delivery_date: Joi.string().allow(null, ''),
  used_products: Joi.array().items(Joi.object()).default([]),
})

export const changeOrderStatusSchema = Joi.object({
  repair_order_id: Joi.number().integer().required(),
  previous_status: Joi.string().valid('P', 'I', 'R', 'N'),
  new_status: Joi.string().valid('P', 'I', 'R', 'N').required(),
  comment: Joi.string().optional(),
  used_products: Joi.array()
    .items(
      Joi.object({
        product_id: Joi.number().integer().required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .default([])
    .optional(),
})
