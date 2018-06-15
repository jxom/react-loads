// @flow
const serialize = (data: any): ?string => JSON.stringify(data);

const deserialize = (stringValue: ?string): any => {
  if (!stringValue) return;

  let value = '';
  try {
    value = JSON.parse(stringValue);
  } catch (e) {
    value = stringValue;
  }
  return value;
};

export default {
  serialize,
  deserialize
};