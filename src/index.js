import BaseComponent from './components/base-component.js';
import Router from './core/router/index.js';
import Link from './core/router/link.js';
import Store from './core/store/index.js';
import reducers from './reducers/index.js';
import connectToStore from './core/store/connect.js';

const navigationConfig = [
  {
    url: '/',
    html: `<i class="bi bi-shop"></i><span>Products</span>`,
    attributes: {
      class: 'link-unstyled'
    }
  },
  {
    url: '/wishlist',
    html: `<i class="bi bi-star"></i>Wishlist <span data-element="wishlistCounter">0</span>`,
    attributes: {
      class: 'link-unstyled'
    }
  },
  {
    url: '/cart',
    html: `<i class="bi bi-cart"></i>Cart <span data-element="cartCounter">0</span>`,
    attributes: {
      class: 'link-unstyled'
    }
  }
];

class App extends BaseComponent {
  subElements = {};

  constructor(store) {
    super();

    this.router = Router.instance;
    this.store = store;
    this.render();
    this.renderTitle();
    this.renderNavigationLinks();

    this.initEventListeners();
  }

  renderTitle () {
    const link = new Link({
      url: '/',
      html: 'Online Store',
      attributes: {
        class: 'link-unstyled'
      }
    });

    this.subElements.title.append(link.element);
  }

  renderNavigationLinks () {
    const links = navigationConfig.map(linkProps => {
      const { url, html, attributes } = linkProps;

      const isActive = `/${this.router.strippedPath}` === url;
      const li = document.createElement('li');

      const link = new Link({ url, html, attributes }).element;

      if (isActive) {
        link.classList.add(Link.activeClassName);
      }

      li.append(link);

      return li;
    });

    this.subElements.navigation.append(...links);
  }

  get template() {
    return `<div class="os-container">
      <main class="os-products">
        <aside class="sidebar">
          <h2 class="sidebar__title" data-element="title">
            <!-- Title -->
          </h2>
          <ul class="sidebar__nav" data-element="navigation">
            <!-- Navigation -->
          </ul>
        </aside>

        <section id="page-content">
          <!-- Page content -->
        </section>
      </main>
    </div>`;
  }

  initializeRouter() {
    this.router
      .addRoute(/^$/, 'main')
      .addRoute(/^cart$/, 'cart')
      .addRoute(/^wishlist$/, 'wishlist')
      .addRoute(/404\/?$/, 'error404')
      .listen();
  }

  initEventListeners () {
    this.subElements.navigation.addEventListener('pointerdown', event => {
      const link = event.target.closest('a');

      if (link) {
        const otherLinks = event.currentTarget.querySelectorAll('a');

        for (const otherLink of otherLinks) {
          otherLink.classList.remove(Link.activeClassName);
        }

        link.classList.add(Link.activeClassName);
      }
    });

    this.store.subscribe('ADD_PRODUCT', () => {
      const cartCounter = this.element.querySelector('[data-element="cartCounter"]');

      cartCounter.innerText = this.store.getState().products.length;
    });

    this.store.subscribe('REMOVE_PRODUCT', () => {
      const cartCounter = this.element.querySelector('[data-element="cartCounter"]');

      cartCounter.innerText = this.store.getState().products.length;

    });

    this.store.subscribe('ADD_TO_WISHLIST', () => {
      const wishlistCounter = this.element.querySelector('[data-element="wishlistCounter"]');

      wishlistCounter.innerText = this.store.getState().wishlist.length;
    });

    this.store.subscribe('REMOVE_FROM_WISHLIST', () => {
      const wishlistCounter = this.element.querySelector('[data-element="wishlistCounter"]');

      wishlistCounter.innerText = this.store.getState().wishlist.length;
    });
  }
}

// TODO: move to "create-store" module
const storeKey = Symbol.for('storeKey');
const initStore = {
  counter: 0,
  loader: false,
  products: [],
  wishlist: []
};

const store = new Store(reducers, initStore);

globalThis[storeKey] = store;

const ConnectedApp = connectToStore(App);
const app = new ConnectedApp();

document.body.append(app.element);

app.initializeRouter();
