import Search from '../../components/search/index.js';
import CardsList from '../../components/cards-list/index.js';
import NotificationManager from '../../components/notification/notification-manager/index.js';
import InfinityList from "../../components/infinity-list/index.js";
import SortableTable from "../../components/sortable-table/index.js";

import httpRequest from '../../core/request/index.js';
import connectToObserver from "../../core/observer/connect.js";
import connectToStore from "../../core/store/connect.js";

import RequestBuilder from '../../api/index.js';

import './main.css';

// NOTE: temporary commented
// import DoubleSlider from "../../components/double-slider";

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
          <div data-element="doubleSlider">
            <!-- DoubleSlider component -->
          </div>
          <div class="list-view-controls">
            <i class="bi bi-list" data-element="listBtn"></i>
            <i class="bi bi-grid" data-element="gridBtn"></i>
          </div>
        </div>


        <div data-element="list">
          <!-- Cards List component -->
        </div>
      </div>
    `;
  }

  initComponents() {
    const cardsList = new CardsList(this.products);
    const list = new InfinityList(cardsList, { step: this.pageSize });
    const search = new Search();
    // NOTE: temporary commented
    // const doubleSlider = new DoubleSlider({
    //   min: 3,
    //   max: 1200,
    //   formatValue: value => `$${value}`,
    // });

    // NOTE: destroy component manually
    this.notificationManager = new NotificationManager({ stackLimit: 3 });

    this.components = {
      list,
      search,
      // doubleSlider
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

      this.notificationManager.show(`Product "${title}" was successfully ${action} to wishlist`, 'info');
    });

    this.registerObserverEvent('add-to-cart', payload => {
      const { status, product } = payload;
      const { title } = product;
      const action = status ? 'added' : 'removed';

      this.notificationManager.show(`Product "${title}" was successfully ${action} to cart`, 'info');
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
        .addFilter(from ,to);

      this.update();
    });

    // TODO: make refactoring
    this.subElements.gridBtn.addEventListener('pointerdown', event => {
      this.components.list.remove();

      const cardsList = new CardsList(this.products);

      this.components.list = new InfinityList(cardsList, { step: this.pageSize });

      this.subElements.list.innerHTML = '';
      this.subElements.list.append(this.components.list.element);
    });

    // TODO: make refactoring
    this.subElements.listBtn.addEventListener('pointerdown', event => {
      this.components.list.remove();

      const sortableTable = new SortableTable([
        {
          id: 'images',
          title: 'Image',
          sortable: false,
          template: data => {
            return `
              <td class="col">
                <img class="sortable-table-image" alt="Image" src="${data[0].url}">
              </td>`;
          }
        },
        {
          id: 'rating',
          title: 'rating',
          sortable: true,
          sortType: 'number'
        },
        {
          id: 'price',
          title: 'Price',
          sortable: true,
          sortType: 'number'
        },
        {
          id: 'title',
          title: 'Title',
          sortable: true,
          sortType: 'string'
        },
        {
          id: 'description',
          title: 'Description',
          sortable: true,
          sortType: 'string',
          template: description => {
            return `
              <td class="col">
                ${description.slice(0, 50) + '...'}
              </td>`;
          }
        }
      ], {
        data: this.products
      });

      this.components.list = new InfinityList(sortableTable, { step: this.pageSize });

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
