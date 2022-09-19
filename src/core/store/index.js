// NOTE: Pattern. Mediator
export default class Store {
  static #instance;

  state = {};

  listeners = [];

  // NOTE: Pattern: Singleton
  constructor(reducers = {}, initialState = {}) {
    if (Store.#instance) {
      return Store.#instance;
    }

    this.reducers = reducers;
    this.state = {...initialState};

    Store.#instance = this;
  }

  getState = (slice) => {
    if (slice) {
      return this.state[slice];
    }

    return this.state;
  };

  setState = (slice, value) => {
    this.state[slice] = value;
  };

  dispatch (action = {}) {
    const { type, payload } = action;

    console.error('action', action);

    for (const reducerName of Object.keys(this.reducers)) {
      const reducerMethod = this.reducers[reducerName][type];

      if (reducerMethod) {
        const state = this.getState(reducerName);

        console.error('current state', state);

        const nextValue = reducerMethod(state, payload);

        this.setState(reducerName, nextValue);

        console.error('next state', this.getState());

        const listeners = this.listeners[type];

        if (listeners) {
          const state = this.getState(reducerName);

          for (const [listener] of listeners.entries()) {
            listener(state);
          }
        }
      }
    }
  }

  subscribe (eventName, listener) {
    if (this.listeners[eventName]) {
      this.listeners[eventName].set(listener, null);
    } else {
      this.listeners[eventName] = new Map([[listener, null]]);
    }

    return () => {
      return this.listeners[eventName].delete(listener);
    };
  }
}

