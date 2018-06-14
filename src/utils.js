// @flow
export const Global = typeof window !== 'undefined' ? window : global;

export const serialize = (data: any): ?string => JSON.stringify(data);

export const deserialize = (stringValue: ?string): any => {
  if (!stringValue) return;

  let value = '';
  try {
    value = JSON.parse(stringValue);
  } catch (e) {
    value = stringValue;
  }
  return value;
};
