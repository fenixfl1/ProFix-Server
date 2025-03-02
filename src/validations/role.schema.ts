import Joi from 'joi'

export const createRoleSchema = Joi.object({
  name: Joi.string().required(),
  created_by: Joi.number().required(),
  description: Joi.string().required(),
  menu_options: Joi.array().items(Joi.string().required()),
})

export const assignPermissionsSchema = Joi.object({
  role_id: Joi.number().required(),
  menu_options: Joi.array().items(Joi.string().required()),
})

export const updateRoleSchema = Joi.object({
  role_id: Joi.number().required(),
  name: Joi.string().optional(),
  created_by: Joi.number().optional(),
  description: Joi.string().optional(),
  menu_options: Joi.array().items(Joi.string().required()),
  state: Joi.string().optional(),
})
