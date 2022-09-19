import Search from '../../components/search/index.js';
import CardsList from '../../components/cards-list/index.js';
import NotificationManager from '../../components/notification/notification-manager/index.js';
import InfinityList from '../../components/infinity-list/index.js';
import SortableTable from '../../components/sortable-table/index.js';
import headerConfig from './sortable-table-config.js';
import Card from '../../components/card';

import httpRequest from '../../core/request/index.js';
import connectToObserver from '../../core/observer/connect.js';
import connectToStore from '../../core/store/connect.js';

import RequestBuilder from '../../api/index.js';
import SyncStorage from "../../core/storage/sync-storage";

import './main.css';

class OnlineStorePage {
  subscriptions = [];
  subElements = [];
  components = {};
  pageSize = 10;
  products = [];

  constructor(match, store, observer) {
    this.store = store;
    this.observer = observer;

    this.url = new RequestBuilder('products');
    this.storage = new SyncStorage().create('local');

    this.initComponents();
    this.render();
    this.getSubElements();
    this.renderComponents();
    this.initEventListeners();

    const start = 1;
    const end = start + this.pageSize;

    this.url.addPagination(start, end);

    this.add(start, end);
  }

  async loadData() {
    return await httpRequest.get(this.url);
  }

  getTemplate() {
    return `
      <div class="page-container">
        <h1 class="page-title">Products</h1>

        <div class="filters-panel">
          <div data-element="search">
            <!-- Search component -->
          </div>
          <div class="list-view-controls">
            <i class="bi bi-list ${this.getMode() === 'table' ? 'active' : ''}" data-element="listBtn"></i>
            <i class="bi bi-grid ${this.getMode() === 'grid' ? 'active' : ''}" data-element="gridBtn"></i>
          </div>
        </div>

        <div data-element="list">
          <!-- Cards List component -->
        </div>
      </div>
    `;
  }

  getMode () {
    const defaultMode = 'grid';

    return this.storage.get('mode') || defaultMode;
  }

  setMode (mode = '') {
    return this.storage.add('mode', mode);
  }

  initListComponent (mode = '') {
    const currentMode = mode;

    const modes = {
      grid: () => new CardsList({
        data: this.products,
        CardComponent: Card
      }),
      table: () => new SortableTable(headerConfig, { data: this.products })
    };

    return new InfinityList(modes[currentMode](), { step: this.pageSize });
  }

  initComponents() {
    const mode = this.getMode();
    const list = this.initListComponent(mode);
    const search = new Search();

    // NOTE: destroy component manually
    this.notificationManager = new NotificationManager({ stackLimit: 3 });

    this.components = {
      list,
      search
    };
  }

  renderComponents () {
    for (const componentName of Object.keys(this.components)) {
      const root = this.subElements[componentName];
      const { element } = this.components[componentName];

      root.append(element);
    }
  }

  getSubElements () {
    const result = {};
    const elements = this.element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    this.subElements = result;
  }

  render() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getTemplate();

    this.element = wrapper.firstElementChild;
  }

  async add () {
    const products = await this.loadData();

    this.products.push(...products);

    this.components.list.add(products);
  }

  async update () {
    const products = await this.loadData();

    this.products = [...products];

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

  initEventListeners() {
    this.registerObserverEvent('load-data', payload => {
      const { start, end } = payload;

      this.url.addPagination(start, end);

      this.add();
    });

    this.registerObserverEvent('add-to-wishlist', payload => {
      const { status, product } = payload;
      const { title } = product;
      const action = status ? 'added' : 'removed';

      const message = `Product "${title}" was successfully ${action} to wishlist`;
      const type = status ? 'success' : 'info';

      this.notificationManager.show(message, type);
    });

    this.registerObserverEvent('add-to-cart', payload => {
      const { status, product } = payload;
      const { title } = product;
      const action = status ? 'added' : 'removed';

      const message = `Product "${title}" was successfully ${action} to cart`;
      const type = status ? 'success' : 'info';

      this.notificationManager.show(message, type);
    });

    this.registerObserverEvent('search-filter', searchString => {
      this.url
        .resetSearchParams()
        .addSearch(searchString);

      this.update();
    });

    this.registerObserverEvent('range-selected', payload => {
      const { from, to } = payload;
      this.url
        .resetSearchParams()
        .addFilter(from, to);

      this.update();
    });

    this.registerObserverEvent('sort-table', payload => {
      const { id, order } = payload;
      const start = 1;
      const end = start + this.pageSize;

      this.url
        .addPagination(start, end)
        .addSort(id, order);

      this.update();
    });

    // TODO: make refactoring
    this.subElements.gridBtn.addEventListener('pointerdown', () => {
      this.subElements.listBtn.classList.remove('active');
      this.subElements.gridBtn.classList.add('active');

      this.components.list.remove();
      this.setMode('grid');
      this.components.list = this.initListComponent('grid');

      this.subElements.list.innerHTML = '';
      this.subElements.list.append(this.components.list.element);
    });

    // TODO: make refactoring
    this.subElements.listBtn.addEventListener('pointerdown', () => {
      this.subElements.gridBtn.classList.remove('active');
      this.subElements.listBtn.classList.add('active');

      this.components.list.remove();
      this.setMode('table');
      this.components.list = this.initListComponent('table');

      this.subElements.list.innerHTML = '';
      this.subElements.list.append(this.components.list.element);
    });
  }

  remove () {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;

    for (const component of Object.values(this.components)) {
      if (component.destroy) {
        component.destroy();
      }
    }

    // NOTE: destroy component manually
    this.notificationManager.destroy();

    this.subscriptions = [];
  }
}

export default connectToStore(connectToObserver(OnlineStorePage));
