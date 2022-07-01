import Router from './router/index.js';
import Store from './core/store/index.js';
import reducers from './reducers/index.js';

class App {
  constructor() {
    this.router = Router.instance;
    this.render();
  }

  get template() {
    return `<div class="os-container">
      <main class="os-products">
        <!-- SideBar -->
        <aside class="sidebar">
          <h2 class="sidebar__title">
            <a class="link-unstyled" href="/">Online Store</a>
          </h2>
          <ul class="sidebar__nav">
            <li class="active">
              <a class="link-unstyled" href="/" data-page="products">
                <i class="bi bi-shop"></i>
                <span>Products</span>
              </a>
            </li>
            <li>
              <a class="link-unstyled" href="/wishlist" data-page="wishlist">
                <i class="bi bi-star"></i>
                <span>Wishlist</span>
              </a>
            </li>
            <li>
              <a class="link-unstyled" href="/cart" data-page="cart">
                <i class="bi bi-cart"></i>
                <span>Cart</span>
              </a>
            </li>
          </ul>
        </aside>

        <section id="page-content">

        </section>
      </main>
    </div>`;
  };

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.template;

    this.element = element.firstElementChild;
  }

  initializeRouter() {
    this.router
      .addRoute(/^$/, 'main')
      .addRoute(/^cart$/, 'cart')
      .addRoute(/^wishlist$/, 'wishlist')
      .addRoute(/404\/?$/, 'error404')
      .listen();
  }
}

const app = new App();
const storeKey = Symbol.for('storeKey');
const initStore = {
  counter: 0,
  loader: false,
  products: []
};

const store = new Store(reducers, initStore);

globalThis[storeKey] = store;

document.body.append(app.element);

app.initializeRouter();
