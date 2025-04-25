import { AppDataSource } from '../config/database/ormconfig'
export const ORA_DATETIME_FORMAT = 'RRRR-MM-DD HH24:MI:SS.MS'
export const ORA_DATE_FORMAT = 'RRRR-MM-DD'

/**
 * Generates an Oracle `TO_DATE` SQL expression to convert a string into a valid date.
 *
 * @param date - The date string to be converted.
 * @param format - The date format to use (default: 'YYYY-MM-DD HH24:MI:SS').
 * @returns A SQL string using `TO_DATE` with the provided date and format.
 *
 * @example
 * to_date('1964-04-26 01:00:00');
 * // Returns: "TO_DATE('1964-04-26 01:00:00', 'YYYY-MM-DD HH24:MI:SS')"
 *
 * @example
 * to_date('26-04-1964', 'DD-MM-YYYY');
 * // Returns: "TO_DATE('26-04-1964', 'DD-MM-YYYY')"
 */
export const to_date = (date: string, format = ORA_DATE_FORMAT): string =>
  `TO_DATE(${date}, '${format}')`

/**
 * Generates an Oracle SQL expression to normalize a text field by removing accents.
 *
 * This function uses `TRANSLATE` to replace accented characters with their non-accented equivalents
 * and `UPPER` to convert the text to uppercase.
 *
 * @param field - The database field to apply the transformation.
 * @returns A SQL string that applies `TRANSLATE` and `UPPER` to the given field.
 *
 * @example
 * translate('nombre');
 * // Returns: "UPPER(TRANSLATE(nombre, 'áéíóúüñÁÉÍÓÚÜÑ', 'aeiouunAEIOUUN'))"
 *
 * @example
 * translate('acción');
 * // Returns: "UPPER(TRANSLATE(action, 'áéíóúüñÁÉÍÓÚÜÑ', 'aeiouunAEIOUUN'))"
 */
export const translate = (field: string): string => {
  return `UPPER(TRANSLATE(${field}, 'áéíóúüñÁÉÍÓÚÜÑ', 'aeiouunAEIOUUN'))`
}

/**
 * Run a query and return the result
 * @param statement SQL statement
 * @returns Result of the query
 */
export async function queryRunner<T = unknown>(
  statement: string,
  params?: string[]
): Promise<T[]> {
  const result = await AppDataSource.query(statement, params)

  return result
}

/**
 * MySQL DATE_FORMAT
 * @param field - The database field to apply the transformation.
 * @param format - The date format to use (default: '%M %Y').
 * @return A SQL string that applies `DATE_FORMAT` to the given field.
 */
export const mysqlDateFormat = (field: string, format = '%M %Y'): string => {
  return `DATE_FORMAT(${field}, '${format}')`
}
