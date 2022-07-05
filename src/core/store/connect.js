// NOTE: Pattern Decorator
const connectToStore = Component => class extends Component {
  static name = `connected to store ${Component.name}`;

  constructor(...props) {
    const store = globalThis[Symbol.for('storeKey')];

    props.push(store);

    super(...props);
  }

  destroy () {
    if (this.subscriptions?.length) {
      for (const unsubscribe of this.subscriptions) {
        unsubscribe();
      }
    }

    if (super.destroy) {
      super.destroy();
    }
  }
};

export default connectToStore;
