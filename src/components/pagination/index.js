import BaseComponent from '../base-component.js';
import connectToObserver from '../../core/observer/connect.js';

import './pagination.css';

class Pagination extends BaseComponent {
  constructor(
    {
      activePageIndex = 0,
      totalPages = 0
    } = {},
    observer
  ) {
    super();

    this.activePageIndex = activePageIndex;
    this.totalPages = totalPages;
    this.observer = observer;

    this.render();
    this.addEventListeners();
  }

  get template() {
    return `
      <nav class="os-pagination" hidden>
        <a href="#" class="page-link previous" data-element="nav-prev">
          <i class="bi bi-chevron-left"></i>
        </a>
        <ul class="page-list" data-element="pagination">
          ${this.getPages()}
        </ul>
        <a href="#" class="page-link next" data-element="nav-next">
          <i class="bi bi-chevron-right"></i>
        </a>
      </nav>
    `;
  }

  getPages() {
    return new Array(this.totalPages).fill(1).map((item, index) => {
      return this.getPageTemplate(index);
    }).join('');
  }

  getPageTemplate(pageIndex = 0) {
    const isActive = pageIndex === this.activePageIndex ? 'active' : '';

    return `<li>
      <a href="#"
        data-element="page-link"
        class="page-link ${isActive}"
        data-page-index="${pageIndex}">
        ${pageIndex + 1}
      </a>
    </li>`;
  }

  setPage(pageIndex = 0) {
    if (pageIndex === this.activePageIndex) return;
    if (pageIndex > this.totalPages - 1 || pageIndex < 0) return;

    this.dispatchEvent(pageIndex);

    const activePage = this.element.querySelector('.page-link.active');

    if (activePage) {
      activePage.classList.remove('active');
    }

    const nextActivePage = this.element.querySelector(`[data-page-index="${pageIndex}"]`);

    if (nextActivePage) {
      nextActivePage.classList.add('active');
    }

    this.activePageIndex = pageIndex;
  }

  nextPage() {
    const nextPageIndex = this.activePageIndex + 1;

    this.setPage(nextPageIndex);
  }

  prevPage() {
    const prevPageIndex = this.activePageIndex - 1;

    this.setPage(prevPageIndex);
  }

  render() {
    super.render();

    if (this.totalPages) {
      this.element.removeAttribute('hidden');
    }
  }

  update (totalPages) {
    this.totalPages = totalPages;

    if (this.totalPages === 0) {
      this.element.setAttribute('hidden', true);
    }

    const pagesList = this.element.querySelector('[data-element="pagination"]');

    pagesList.innerHTML = this.getPages();
  }

  addEventListeners() {
    const prevPageBtn = this.element.querySelector('[data-element="nav-prev"]');
    const nextPageBtn = this.element.querySelector('[data-element="nav-next"]');
    const pagesList = this.element.querySelector('[data-element="pagination"]');

    prevPageBtn.addEventListener('click', event => {
      event.preventDefault();

      this.prevPage();
    });

    nextPageBtn.addEventListener('click', event => {
      event.preventDefault();

      this.nextPage();
    });

    pagesList.addEventListener('click', event => {
      event.preventDefault();

      const pageItem = event.target.closest('.page-link');

      if (!pageItem) return;

      const {pageIndex} = pageItem.dataset;

      this.setPage(parseInt(pageIndex, 10));
    });
  }

  dispatchEvent(pageIndex) {
    this.observer.dispatchEvent({
      type: 'page-changed',
      payload: pageIndex
    });
  }
}

export default connectToObserver(Pagination);
