import CardsList from '../../components/cards-list/index.js';
import Pagination from '../../components/pagination/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru/api/rest/products';

export default class OnlineStorePage {
  constructor () {
    this.pageSize = 3;
    this.products = [];

    this.url = new URL('products', BACKEND_URL);
    this.url.searchParams.set('_limit', this.pageSize);

    this.components = {};

    this.initComponents();
    this.render();
    this.renderComponents();

    this.initEventListeners();

    this.update(1);
  }

  // TODO: move to separate module
  async loadData (pageNumber) {
    const start = (pageNumber - 1) * this.pageSize;
    const end = start + this.pageSize;

    this.url.searchParams.set('_start', start);
    this.url.searchParams.set('_end', end);

    const response = await fetch(this.url);
    const products = await response.json();

    return products;
  }

  getTemplate () {
    return `
      <div>
        <div data-element="cardsList">
          <!-- Cards List component -->
        </div>
        <div data-element="pagination" class="os-products-footer">
          <!-- Pagination component -->
        </div>
      </div>
    `;
  }

  initComponents () {
    // TODO: remove hardcoded value
    const totalElements = 30;
    const totalPages = Math.ceil(totalElements / this.pageSize);

    const cardList = new CardsList(this.products);
    const pagination = new Pagination({
      activePageIndex: 0,
      totalPages
    });

    this.components.cardList = cardList;
    this.components.pagination = pagination;
  }

  renderComponents () {
    const cardsContainer = this.element.querySelector('[data-element="cardsList"]');
    const paginationContainer = this.element.querySelector('[data-element="pagination"]');

    cardsContainer.append(this.components.cardList.element);
    paginationContainer.append(this.components.pagination.element);
  }

  render () {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getTemplate();

    this.element = wrapper.firstElementChild;
  }

  initEventListeners () {
    this.components.pagination.element.addEventListener('page-changed', event => {
      const pageIndex = event.detail;

      this.update(pageIndex + 1);
    });
  }

  async update (pageNumber) {
    const data = await this.loadData(pageNumber);

    this.components.cardList.update(data);
  }
}
