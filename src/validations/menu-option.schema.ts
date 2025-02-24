import Joi from 'joi'

export const createMenuOptionSchema = Joi.object({
  name: Joi.string().max(100).required(),
  description: Joi.string().max(250).allow(null, ''),
  path: Joi.string().max(100).allow(null, ''),
  type: Joi.string().valid('group', 'divider', 'link').allow(null),
  icon: Joi.string().allow(null, ''),
  parent_id: Joi.string().allow(null),
  content: Joi.string().allow(null, ''),
  created_by: Joi.number().required(),
  menu_option_id: Joi.string().optional(),
})
