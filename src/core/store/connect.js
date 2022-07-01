// NOTE: Pattern Decorator
const connectToStore = Component => class extends Component {
  static name = `connected to store ${Component.name}`;

  constructor(...props) {
    const store = globalThis[Symbol.for('storeKey')];

    props.push(store);

    super(...props);
  }
};

export default connectToStore;
