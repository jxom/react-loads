// @flow
import { Global, serialize, deserialize } from '../utils';

const get = (key: string) => {
  const data = Global.localStorage.getItem(key);
  return deserialize(data);
};

const set = (key: string, data: ?any) => {
  if (!data && data === undefined) {
    Global.localStorage.removeItem(key);
  } else {
    Global.localStorage.setItem(key, serialize(data));
  }
  return data;
};

export default {
  get,
  set
};
