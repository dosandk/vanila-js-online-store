import { getSubElements } from '../../core/dom/index.js';
import connectToStore from '../../core/store/connect.js';
import Cart from '../../components/cart';
import connectToObserver from '../../core/observer/connect';

class CartPage {
  subElements = {};
  components = {};

  constructor (match, store, observer) {
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

  getTemplate () {
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

  render () {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getTemplate();

    this.element = wrapper.firstElementChild;

    this.subElements = getSubElements(this.element);
  }

  remove () {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy () {
    this.remove();

    for (const component of Object.values(this.components)) {
      if (component.destroy) {
        component.destroy();
      }
    }

    this.components = {};
  }
}

// NOTE: Pattern. Decorator
export default connectToStore(connectToObserver(CartPage));
