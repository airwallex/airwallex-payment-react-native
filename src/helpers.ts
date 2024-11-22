function camelCaseToSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export function transformKeysToSnakeCase(
  obj: Record<string, any> | undefined
): Record<string, any> {
  const transformed: Record<string, any> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      transformed[camelCaseToSnakeCase(key)] = obj[key];
    }
  }

  return transformed;
}
