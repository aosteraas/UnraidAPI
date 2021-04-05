export type DefinedKeys = { key: string; value: string | number | boolean };
export type UndefinedKeys = Partial<DefinedKeys>;

export function isDefined(data: UndefinedKeys): data is DefinedKeys {
  try {
    const hasKeys = 'key' in data && 'value' in data;
    const hasValues = data.key !== undefined && data.value !== undefined;
    return hasKeys && hasValues;
  } catch {
    return false;
  }
}
