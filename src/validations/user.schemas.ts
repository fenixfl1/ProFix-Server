import Joi from 'joi'
import { requiredString, joiString } from './validation-types'

export const loginSchema = Joi.object().keys({
  username: requiredString,
  password: requiredString,
})

export const resetPasswordSchema = Joi.object().keys({
  password: requiredString,
  token: requiredString,
})

export const requestPasswordResetSchema = Joi.object().keys({
  email: requiredString,
  username: requiredString,
})

export const supervisorLoginSchema = Joi.object().keys({
  username: requiredString,
  password: requiredString,
  supervisorType: requiredString,
})

export const usersByTypeQuerySchema = Joi.object().keys({
  condition: Joi.object().keys({
    ID_EMPRESA: requiredString,
    TIPO_PERSONAL: requiredString,
    ESTADO: joiString,
  }),
})

export const createUserSchema = Joi.object({
  address: Joi.string().allow('', null),
  avatar: Joi.string().optional(),
  birth_date: Joi.date().required(),
  document_type: Joi.string().required(),
  email: Joi.string().email().required(),
  gender: Joi.string().required(),
  identity_document: Joi.string().alphanum().length(11).required(),
  last_name: Joi.string().min(2).max(50).required(),
  name: Joi.string().min(2).max(50).required(),
  password: Joi.string().optional(),
  phone: Joi.string().optional(),
  role_id: Joi.number().optional(),
  username: Joi.string().alphanum().min(3).max(30).required(),
})

export const updateUserSchema = Joi.object({
  address: Joi.any().optional(),
  avatar: Joi.string().optional(),
  birth_date: Joi.date().optional(),
  document_type: Joi.string().optional(),
  email: Joi.string().email().optional(),
  gender: Joi.string().optional(),
  identity_document: Joi.string().alphanum().optional(),
  last_name: Joi.string().min(2).max(50).optional(),
  name: Joi.string().min(2).max(50).optional(),
  password: Joi.string().min(8).max(50).optional(),
  phone: Joi.string().optional(),
  role_id: Joi.number().optional(),
  user_id: Joi.number().required(),
  username: Joi.string().alphanum().min(3).max(30).optional(),
})

export const changePasswordSchema = Joi.object({
  old_password: Joi.string().required(),
  new_password: Joi.string().required(),
})
