import BaseComponent from '../../components/base-component.js';
import { getSubElements } from '../../core/dom/index.js';
import Pagination from '../../components/pagination/index.js';

import connectToStore from '../../core/store/connect.js';
import NotificationManager from "../../components/notification/notification-manager";
import WishCardWrapper from "./wish-card/index.js";
import CardsList from "../../components/cards-list";
import connectToObserver from "../../core/observer/connect";

class WishListPage extends BaseComponent {
  subElements = {};
  components = {};
  subscriptions = [];
  pageSize = 3;

  constructor (match, store, observer) {
    super();
    this.store = store;
    this.observer = observer;

    this.products = this.getWishList();

    this.initialize();
  }

  getWishList () {
    const { wishlist } = this.store.getState();

    return wishlist;
  }

  // NOTE: Pattern. Facade
  initialize () {
    this.initComponents();
    this.render();
    this.renderComponents();
    this.initEventListeners();
  }

  get template () {
    return `
      <div class="page-container">
        <h1 class="page-title">WishList</h1>
        <div data-element="list">
          <!-- Cards List component -->
        </div>
        <div data-element="pagination" class="os-products-footer">
          <!-- Pagination component -->
        </div>
        <div data-element="emptyData">There is no data in the wishlist</div>
      </div>
    `;
  }

  initComponents () {
    const pagination = new Pagination({
      activePageIndex: 0,
      totalPages: Math.ceil(this.products.length / this.pageSize)
    });

    const list = new CardsList({
      data: this.products.slice(0, this.pageSize),
      CardComponent: WishCardWrapper
    });

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
    super.render();

    if (this.products.length) {
      this.subElements.emptyData.setAttribute('hidden', true);
    }
  }

  update(pageIndex) {
    const start = pageIndex * this.pageSize;
    const end = start + this.pageSize;

    const products = this.products.slice(start, end);

    this.components.list.update(products);
  }

  // NOTE: Pattern. Facade
  registerObserverEvent (type, callback) {
    const handler = this.observer.subscribe(type, callback);

    this.subscriptions.push(handler);
  }

  registerStoreEvent (type, callback) {
    const handler = this.store.subscribe(type, callback);

    this.subscriptions.push(handler);
  }

  initEventListeners () {
    this.registerObserverEvent('page-changed', pageIndex => {
      this.update(pageIndex);

      this.notificationManager.show('Page has changed', 'success');
    });

    this.registerStoreEvent('REMOVE_FROM_WISHLIST', () => {
      this.products = this.getWishList();

      this.components.list.update(this.products);

      const totalPages = Math.ceil(this.products.length / this.pageSize);

      this.components.pagination.update(totalPages);

      if (this.products.length === 0) {
        this.subElements.emptyData.removeAttribute('hidden');
      }
    });
  }

  destroy () {
    super.destroy();

    for (const component of Object.values(this.components)) {
      if (component.destroy) {
        component.destroy();
      }
    }

    this.subscriptions = [];
    this.components = null;
  }
}

export default connectToStore(connectToObserver(WishListPage));
