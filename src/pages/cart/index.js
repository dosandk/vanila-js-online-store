import BaseComponent from '../../components/base-component.js';
import Cart from '../../components/cart';
import connectToStore from '../../core/store/connect.js';

class CartPage extends BaseComponent {
  subElements = {};
  components = {};

  constructor (match, store) {
    super();

    this.store = store;

    const { products } = this.store.getState();

    this.products = products;
    this.initialize();
  }

  // NOTE: Pattern. Facade
  initialize () {
    this.initComponents();
    this.render();
    this.renderComponents();
  }

  get template () {
    return `
      <div class="page-container">
        <h1 class="page-title">Cart</h1>
        <div data-element="cart">
          <!-- Cart component -->
        </div>
      </div>
    `;
  }

  initComponents () {
    const cart = new Cart();

    for (const item of this.products) {
      cart.add(item);
    }

    this.components = {
      cart
    };
  }

  renderComponents () {
    for (const componentName of Object.keys(this.components)) {
      const root = this.subElements[componentName];
      const { element } = this.components[componentName];

      root.append(element);
    }
  }

  destroy () {
    super.destroy();

    for (const component of Object.values(this.components)) {
      if (component.destroy) {
        component.destroy();
      }
    }

    this.components = {};
  }
}

// NOTE: Pattern. Decorator
export default connectToStore(CartPage);
