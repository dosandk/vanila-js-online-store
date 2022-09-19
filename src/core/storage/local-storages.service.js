// NOTE: Patter. Adapter
export default class LocalStorageService {
  #storage;

  constructor (prefix = '', storage) {
    const border = ':';
    this.prefix = prefix ? `${prefix}${border}` : '';

    this.#storage = storage;
  }

  add (key, value) {
    return this.#storage.setItem(`${this.prefix}${key}`, JSON.stringify(value));
  }

  get (key) {
    return JSON.parse(this.#storage.getItem(`${this.prefix}${key}`));
  }

  remove (key) {
    return this.#storage.removeItem(`${this.prefix}${key}`);
  }

  getAll () {
    const keys = Object.keys(this.#storage);
    const serviceKeys = keys.filter(item => item.startsWith(`${this.prefix}`));

    return serviceKeys.reduce((accum, fullKey) => {
      const key = fullKey.replace(`${this.prefix}`, '');
      accum[key] = this.get(key);
      return accum;
    }, {});
  }

  removeAll () {
    const serviceKeys = Object.keys(this.getAll());

    serviceKeys.forEach(key => {
      this.remove(key);
    });
  }
}
