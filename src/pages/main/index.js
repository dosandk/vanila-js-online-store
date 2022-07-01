import Search from '../../components/search/index.js';
import CardsList from '../../components/cards-list/index.js';
import NotificationManager from '../../components/notification/notification-manager/index.js';
import InfinityList from "../../components/infinity-list/index.js";
import SortableTable from "../../components/sortable-table/index.js";

import httpRequest from '../../core/request/index.js';
import connectToObserver from "../../core/observer/connect.js";
import connectToStore from "../../core/store/connect.js";

const BACKEND_URL = `${process.env.BACKEND_URL}api/rest/`;

import './main.css';

class OnlineStorePage {
  subscriptions = [];
  subElements = [];
  components = {};
  pageSize = 10;
  products = [];
  url = new URL('products', BACKEND_URL);

  constructor(match, store, observer) {
    this.store = store;
    this.observer = observer;

    this.initComponents();
    this.render();
    this.getSubElements();
    this.renderComponents();
    this.initEventListeners();

    const start = 1;
    const end = start + this.pageSize;

    this.add(start, end);
  }

  async loadData(start, end) {
    this.url.searchParams.set('_start', start);
    this.url.searchParams.set('_end', end);

    return await httpRequest.get(this.url);
  }

  getTemplate() {
    return `
      <div>
        <div data-element="search">
          <!-- Search component -->
        </div>

        <div class="list-view-controls">
          <i class="bi bi-list" data-element="listBtn"></i>
          <i class="bi bi-grid" data-element="gridBtn"></i>
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

  async add (start, end) {
    const products = await this.loadData(start, end);

    this.products.push(...products);

    this.components.list.add(products);
  }

  initEventListeners() {
    const loadDataUnsubscribe = this.observer.subscribe('load-data', event => {
      const { start, end } = event.payload;

      this.add(start, end);
    });

    this.subscriptions.push(loadDataUnsubscribe);

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

    for (const unsubscribe of this.subscriptions) {
      unsubscribe();
    }

    this.subscriptions = [];
  }
}

export default connectToStore(connectToObserver(OnlineStorePage));
