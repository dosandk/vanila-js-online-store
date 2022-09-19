import CookieAdapter from "./cookie.adapter.js";
import LocalStorageService from "./local-storages.service.js";
import MemoryAdapter from "./memory.adapter.js";

export default class SyncStorage {
  static #instance;

  // NOTE: Pattern: Singleton
  constructor () {
    if (SyncStorage.#instance) {
      return SyncStorage.#instance;
    }

    SyncStorage.#instance = this;
  }

  // NOTE: Pattern. Factory method
  create (storageType = '', prefix = '') {
    const storages = {
      local: () => new LocalStorageService(prefix, window.localStorage),
      session: () => new LocalStorageService(prefix, window.sessionStorage),
      cookie: () => new CookieAdapter(),
      memory: () => new MemoryAdapter()
    };

    const getStorage = storages[storageType];

    if (getStorage === undefined) {
      throw Error(`There is no storage "${storageType}", ` +
        `please use next storage types: \n "${Object.keys(storages).join(', ')}"`);
    }

    return getStorage();
  }
}
