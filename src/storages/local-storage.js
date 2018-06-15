// @flow
import Global from '../utils/_global';
import Serializer from '../utils/serializer';

const get = (key: string) => {
  const data = Global.localStorage.getItem(key);
  return Serializer.deserialize(data);
};

const set = (key: string, data: ?any) => {
  if (!data && data === undefined) {
    Global.localStorage.removeItem(key);
  } else {
    Global.localStorage.setItem(key, Serializer.serialize(data));
  }
  return data;
};

export default {
  get,
  set
};
