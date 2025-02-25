import { AdvancedCondition } from '../types/api.types'

interface WhereClauseResult {
  whereClause: string
  parameters: string[]
}

export const buildWhereClause = (
  condition: AdvancedCondition[]
): WhereClauseResult => {
  if (!condition.length) return { whereClause: '1=1', parameters: [] } // Siempre verdadero si no hay filtros

  const whereConditions: string[] = []
  const parameters: any[] = [] // Ahora es un array en lugar de un objeto

  condition.forEach(({ field, value, operator }) => {
    let formattedValue = value

    // Si el operador es LIKE, agregamos los % para hacer coincidencia parcial
    if (operator.toUpperCase() === 'LIKE') {
      formattedValue = `%${value}%`
    }

    // Agregamos el valor directamente a los parámetros
    parameters.push(formattedValue)

    // Aplicamos la normalización de caracteres acentuados
    const normalizedField = `
      UPPER(
        REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
          ${field}, 
          'á', 'a'), 'é', 'e'), 'í', 'i'), 'ó', 'o'), 'ú', 'u'), 'ü', 'u'), 'ñ', 'n'),
          'Á', 'A'), 'É', 'E'), 'Í', 'I'), 'Ó', 'O'), 'Ú', 'U'), 'Ü', 'U'), 'Ñ', 'N'
        )
      )
    `

    whereConditions.push(`${normalizedField} ${operator} ?`)
  })

  return {
    whereClause: whereConditions.join(' AND '),
    parameters,
  }
}
