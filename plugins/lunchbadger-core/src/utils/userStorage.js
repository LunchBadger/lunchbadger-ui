import {getUser} from './auth';

const getKeyName = key => `${key}-${getUser().profile.sub}`;

const userStorage = {
  set: (name, value) => localStorage.setItem(getKeyName(name), value),
  get: name => localStorage.getItem(getKeyName(name)),
  getNumber: name => +localStorage.getItem(getKeyName(name)) || 0,
  remove: name => localStorage.removeItem(getKeyName(name)),
  exists: name => localStorage.getItem(getKeyName(name)) != null,
};

Object.assign(userStorage, {
  getObjectKey: (name, key) => JSON.parse(userStorage.get(name) || '{}')[key],
  setObjectKey: (name, key, value) => {
    const items = JSON.parse(userStorage.get(name) || '{}');
    items[key] = value;
    userStorage.set(name, JSON.stringify(items));
  },
  removeObjectKey: (name, key) => {
    const items = JSON.parse(userStorage.get(name) || '{}');
    delete items[key];
    userStorage.set(name, JSON.stringify(items));
  },
  removeObjectKeyStartingWith: (name, startingWith) => {
    const items = JSON.parse(userStorage.get(name) || '{}');
    Object.keys(items).forEach((key) => {
      if (key.startsWith(startingWith)) {
        delete items[key];
      }
    });
    userStorage.set(name, JSON.stringify(items));
  },
});

export default userStorage;
