import { format } from 'util'
import {
  CONDITION_FIELD_VALUE_ERROR_MESSAGE,
  INVALID_ARRAY_VALUE_FOR_OPERATOR,
  INVALID_DATA_TYPE_FOR_CONDITION,
  INVALIDA_DATA_TYPE_ERROR_MESSAGE,
  UNSUPPORTED_OPERATOR_ERROR_MESSAGE,
} from '../constants/messages'
import { AdvancedCondition } from '../types/api.types'
import { QueryValidationError } from './error-api'
import { sanitizeValue } from './sanitize-value'
import { isValidDate } from './isValidDate'
import { detectSQLInjection } from './detectSQLInjection'
import { to_date, translate } from './query-utils'

interface QueryBuilderReturn {
  whereClause: string
  params: Record<string, unknown>
}

const buildSQLCondition = (
  field: string,
  operator: string,
  placeholder: string
): string => ` AND ${translate(field)} ${operator} ${placeholder}`

/**
 * Constructs a dynamic SQL WHERE clause and parameters based on given conditions.
 * @param {AdvancedCondition[]} conditions - Array of conditions for the query.
 * @returns {QueryBuilderReturn} - SQL query string and prepared parameters.
 */
export function whereClauseBuilder(
  conditions: AdvancedCondition<Record<string, unknown>>[]
): QueryBuilderReturn {
  const allowedOperators = [
    '!=',
    '<',
    '<=',
    '<>',
    '=',
    '>',
    '>=',
    'BETWEEN',
    'IN',
    'IS NULL',
    'LIKE',
    'NOT IN',
    'OR =',
  ]

  let whereClause = ''
  const params: Record<string, unknown> = {}

  conditions.forEach((condition, index) => {
    const { field, operator, value } = condition

    const suspicious = detectSQLInjection(value)

    if (suspicious?.length) {
      QueryValidationError(suspicious)
    }

    if (!field || !operator || (!value && typeof value !== 'boolean')) {
      QueryValidationError(CONDITION_FIELD_VALUE_ERROR_MESSAGE)
    }

    if (!allowedOperators.includes(operator)) {
      QueryValidationError(
        format(
          UNSUPPORTED_OPERATOR_ERROR_MESSAGE,
          operator,
          allowedOperators.join(', ')
        )
      )
    }

    const paramPlaceholder = `param_${index}`
    switch (operator) {
      case '!=':
      case '<>':
      case '<':
      case '<=':
      case '=':
      case '>':
      case 'OR =':
      case '>=': {
        if (typeof value !== 'string' && typeof value !== 'number') {
          QueryValidationError(
            format(
              INVALIDA_DATA_TYPE_ERROR_MESSAGE,
              typeof value,
              operator,
              'string, numbers and date'
            )
          )
        }

        if (isValidDate(sanitizeValue(value))) {
          whereClause += buildSQLCondition(
            field,
            operator,
            `${to_date(`:${paramPlaceholder}`)}`
          )
        } else {
          whereClause += buildSQLCondition(
            field,
            operator,
            `:${paramPlaceholder}`
          )
        }
        params[paramPlaceholder] = sanitizeValue(value)
        break
      }
      case 'IS NULL': {
        if (typeof value === 'boolean') {
          whereClause += value
            ? ` AND ${translate(field)} IS NULL`
            : ` AND ${translate(field)} IS NOT NULL`
        } else {
          QueryValidationError(
            format(
              INVALIDA_DATA_TYPE_ERROR_MESSAGE,
              typeof value,
              operator,
              'boolean'
            )
          )
        }
        break
      }
      case 'IN':
      case 'NOT IN': {
        if (Array.isArray(value)) {
          if (value.some((item) => isValidDate(item))) {
            QueryValidationError(
              format(INVALID_DATA_TYPE_FOR_CONDITION, 'DATE', operator)
            )
          }

          const placeholders = value
            .map((_, i) => `UPPER(:${paramPlaceholder}_${i})`)
            .join(', ')

          whereClause += ` AND ${translate(
            field
          )} ${operator} (${placeholders})`

          value.forEach((val, i) => {
            params[`${paramPlaceholder}_${i}`] = sanitizeValue(val)
          })
        } else {
          QueryValidationError(
            format(INVALID_ARRAY_VALUE_FOR_OPERATOR, operator)
          )
        }
        break
      }
      case 'BETWEEN': {
        if (Array.isArray(value) && value.length === 2) {
          const value_0 = sanitizeValue(value[0])
          const value_1 = sanitizeValue(value[1])

          if (isValidDate(value_0) || isValidDate(value_1)) {
            if (value.some((item) => !isValidDate(sanitizeValue(item)))) {
              QueryValidationError(
                'Both values in the array should be of the same data type'
              )
            }
            whereClause += buildSQLCondition(
              field,
              operator,
              `${to_date(`:${paramPlaceholder}_start`)} AND ${to_date(
                `:${paramPlaceholder}_end`
              )}`
            )
          } else {
            whereClause += ` AND ${field} BETWEEN UPPER(:${paramPlaceholder}_start) AND UPPER(:${paramPlaceholder}_end)`
          }

          params[`${paramPlaceholder}_start`] = value_0
          params[`${paramPlaceholder}_end`] = value_1
        } else {
          QueryValidationError('Expected an array of two values for BETWEEN')
        }
        break
      }
      case 'LIKE': {
        if (
          (typeof value !== 'string' && typeof value !== 'number') ||
          isValidDate(sanitizeValue(value))
        ) {
          QueryValidationError(
            format(
              INVALIDA_DATA_TYPE_ERROR_MESSAGE,
              isValidDate(sanitizeValue(value)) ? 'DATE' : typeof value,
              operator,
              'string and numbers'
            )
          )
        }

        whereClause += buildSQLCondition(
          field,
          operator,
          `UPPER(:${paramPlaceholder})`
        )

        params[paramPlaceholder] = `%${sanitizeValue(
          `${value}`.replace(/%/g, ' ').trim()
        )}%`
        break
      }
      default:
        QueryValidationError(
          format(
            UNSUPPORTED_OPERATOR_ERROR_MESSAGE,
            operator,
            allowedOperators.join(', ')
          )
        )
    }
  })

  return { whereClause, params }
}
