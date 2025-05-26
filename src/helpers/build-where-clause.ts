import { AdvancedCondition } from '../types/api.types'

interface WhereClauseResult {
  whereClause: string
  parameters: string[]
}

export const buildWhereClause = (
  condition: AdvancedCondition[]
): WhereClauseResult => {
  if (!condition.length) return { whereClause: '1 = 1', parameters: [] } // Siempre verdadero si no hay filtros

  const whereConditions: string[] = []
  const parameters: any[] = []

  condition.forEach(({ field, value, operator }) => {
    let formattedValue = value

    const normalizedField = `
      UPPER(
        REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
          ${field}, 
          'á', 'a'), 'é', 'e'), 'í', 'i'), 'ó', 'o'), 'ú', 'u'), 'ü', 'u'), 'ñ', 'n'),
          'Á', 'A'), 'É', 'E'), 'Í', 'I'), 'Ó', 'O'), 'Ú', 'U'), 'Ü', 'U'), 'Ñ', 'N'
        )
      )
    `

    switch (operator.toUpperCase()) {
      case 'LIKE':
        formattedValue = `%${value}%`
        parameters.push(formattedValue)
        whereConditions.push(`${normalizedField} LIKE ?`)
        break

      case 'IN':
      case 'NOT IN':
        if (!Array.isArray(value) || value.length === 0) return
        const placeholders = value.map(() => '?').join(', ')
        parameters.push(...value)
        whereConditions.push(`${normalizedField} ${operator} (${placeholders})`)
        break

      case 'BETWEEN':
        if (!Array.isArray(value) || value.length !== 2) return
        parameters.push(value[0], value[1])
        whereConditions.push(`${normalizedField} BETWEEN ? AND ?`)
        break

      default:
        parameters.push(formattedValue)
        whereConditions.push(`${normalizedField} ${operator} ?`)
    }
  })

  return {
    whereClause: whereConditions.join(' AND '),
    parameters,
  }
}
