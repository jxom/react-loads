// @flow
import { serialize, deserialize } from '../utils/serializer';
const _global = typeof window !== 'undefined' ? window : global;

const get = (key: string) => {
  const data = _global.localStorage.getItem(key);
  return deserialize(data);
};

const set = (key: string, data: ?any) => {
  if (!data && data === undefined) {
    _global.localStorage.removeItem(key);
  } else {
    _global.localStorage.setItem(key, serialize(data));
  }
  return data;
};

export default {
  get,
  set
};
