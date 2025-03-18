import Joi from 'joi'

export const createCustomerSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().optional(),
  phone: Joi.string().min(7).max(15).allow(null, ''),
  identity_document: Joi.string().allow(null, ''),
  address: Joi.string().allow(null, ''),
})

export const updateCustomerSchema = Joi.object({
  customer_id: Joi.number().integer().required(),
  name: Joi.string().optional(),
  email: Joi.string().email().allow(null, '').optional(),
  phone: Joi.string().min(7).max(15).allow(null, ''),
  identity_document: Joi.string().allow(null, ''),
  username: Joi.string().min(3).max(50).optional(),
  password: Joi.string().min(6).optional(),
  address: Joi.string().allow(null, ''),
  devices: Joi.array().items(Joi.object()),
  state: Joi.string().allow(null, ''),
})
