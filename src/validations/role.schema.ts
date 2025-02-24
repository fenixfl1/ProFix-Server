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
