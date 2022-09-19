export default class MemoryAdapter {
  #storage = new Map();

  add (key, value) {
    this.#storage.set(key, value);
  }

  get (key) {
    return this.#storage.get(key);
  }

  remove (key) {
    return this.#storage.delete(key);
  }

  getAll () {
    return Object.fromEntries(this.#storage.entries());
  }

  removeAll () {
    for (const key of this.#storage.keys()) {
      this.#storage.delete(key);
    }
  }
}
