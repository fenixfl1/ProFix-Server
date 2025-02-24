/**
 * Converts the keys of an object to uppercase recursively.
 * If a key's value is an object or an array, it processes them recursively.
 * @param object - The object to convert.
 * @return The object with uppercase keys.
 */
export function objectsKeyToUpperCase<T>(object: T): any {
  if (Array.isArray(object)) {
    return object.map((item) => objectsKeyToUpperCase(item))
  } else if (object !== null && typeof object === 'object') {
    return Object.keys(object).reduce(
      (acc, key) => {
        const upperKey = key?.toUpperCase()
        const value = (object as any)[key]

        if (
          value instanceof Date ||
          (typeof value === 'string' && !isNaN(Date.parse(value)))
        ) {
          acc[upperKey] = value
        } else {
          acc[upperKey] = objectsKeyToUpperCase(value)
        }

        return acc
      },
      {} as Record<string, any>
    )
  }

  return object
}
