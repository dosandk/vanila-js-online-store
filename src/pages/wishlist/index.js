import { getSubElements } from '../../core/dom/index.js';
import Pagination from '../../components/pagination/index.js';

import connectToStore from '../../core/store/connect.js';
import NotificationManager from "../../components/notification/notification-manager";
import CardsList from "../../components/cards-list";
import connectToObserver from "../../core/observer/connect";

class WishListPage {
  subElements = {};
  components = {};
  subscriptions = [];
  pageSize = 3;

  constructor (match, store, observer) {
    this.store = store;
    this.observer = observer;

    const { products } = this.store.getState();

    this.products = products;

    this.initialize();
  }

  // NOTE: Pattern. Facade
  initialize () {
    this.initComponents();
    this.render();
    this.renderComponents();
    this.initEventListeners();
  }

  getTemplate () {
    return `
      <div>
        <div data-element="list">
          <!-- Cards List component -->
        </div>
        <div data-element="pagination" class="os-products-footer">
          <!-- Pagination component -->
        </div>
      </div>
    `;
  }

  initComponents () {
    const pagination = new Pagination({
      activePageIndex: 0,
      totalPages: Math.ceil(this.products.length / this.pageSize)
    });

    const list = new CardsList(this.products.slice(0, this.pageSize));

    this.notificationManager = new NotificationManager();

    this.components = {
      list,
      pagination
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

  update(pageIndex) {
    const start = pageIndex * this.pageSize;
    const end = start + this.pageSize;

    const products = this.products.slice(start, end);

    this.components.list.update(products);
  }

  // NOTE: Pattern. Facade
  registerEvent (type, callback) {
    const handler = this.observer.subscribe('page-changed', callback);

    this.subscriptions.push(handler);
  }

  initEventListeners () {
    this.registerEvent('page-changed', event => {
      console.error('event', event);

      const pageIndex = event.payload;

      this.update(pageIndex);

      this.notificationManager.show('Page has changed', 'success');
    });
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

    this.subscriptions = [];
    this.element = null;
    this.components = null;
    this.subElements = null;
  }
}

export default connectToStore(connectToObserver(WishListPage));
