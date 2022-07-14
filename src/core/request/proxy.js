// NOTE: Pattern. Proxy
export default class Proxy {
  proxyCache = new Map();

  constructor({
    maxSize = 10
  } = {}) {
    this.maxSize = maxSize;
  }

  set (key = '', value) {
    if (this.size() === this.maxSize) {
      const oldestKey = [...this.proxyCache.keys()].shift();

      this.proxyCache.delete(oldestKey);
    }

    this.proxyCache.set(key, value);
  }

  has (key) {
    return this.proxyCache.has(key);
  }

  get (key) {
    return this.proxyCache.get(key);
  }

  size () {
    return this.proxyCache.size;
  }
}
