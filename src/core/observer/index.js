// NOTE: Pattern. Observer
export default class Observer {
  static #instance;

  callbacks = {};

  // NOTE: Pattern. Singleton
  static get instance() {
    if (Observer.#instance) {
      return Observer.#instance;
    }

    Observer.#instance = new Observer();

    return Observer.#instance;
  }

  // TODO: add constructor

  dispatchEvent(event) {
    const { type, payload } = event;
    const callbacks = this.callbacks[type];

    if (callbacks) {
      for (const [callback] of callbacks.entries()) {
        callback(payload);
      }
    }
  }

  subscribe (eventName, callback) {
    if (this.callbacks[eventName]) {
      this.callbacks[eventName].set(callback, null);
    } else {
      this.callbacks[eventName] = new Map([[callback, null]]);
    }

    return () => {
      return this.callbacks[eventName].delete(callback);
    };
  }
}
