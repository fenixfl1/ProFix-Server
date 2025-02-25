import {
  DEFAULT_PAGINATION_PAGE_SIZE,
  DEFAULT_PAGINATION_PAGE_NUMBER,
} from '../constants/general'
import Joi from 'joi'

export const queryParamsSchema = Joi.object().keys({
  size: Joi.number().integer().positive().default(DEFAULT_PAGINATION_PAGE_SIZE),
  page: Joi.number()
    .integer()
    .positive()
    .default(DEFAULT_PAGINATION_PAGE_NUMBER),
})
