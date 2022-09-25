import BaseComponent from '../base-component.js';
import connectToObserver from '../../core/observer/connect.js';

import './sortable-table.css';

class SortableTable extends BaseComponent {
  subElements = {};
  headersConfig = [];
  data = [];

  onSortClick = event => {
    const column = event.target.closest('[data-sortable="true"]');

    const toggleOrder = order => {
      const orders = {
        asc: 'desc',
        desc: 'asc'
      };

      return orders[order];
    };

    if (column) {
      const columns = this.element.querySelectorAll('[data-sortable="true"]');
      const { id, order } = column.dataset;
      const newOrder = toggleOrder(order) || 'asc';

      // NOTE: clear all arrows
      columns.forEach(item => item.dataset.order = '');

      column.dataset.order = newOrder;

      this.dispatchEvent('sort-table', {
        id,
        order: newOrder
      });
    }
  };

  constructor (headersConfig, {
    data = [],
    sorted = {
      id: headersConfig.find(item => item.sortable).id,
      order: 'asc'
    }
  } = {}, observer) {
    super();

    this.headersConfig = headersConfig;
    this.data = data;
    this.sorted = sorted;
    this.observer = observer;

    this.render();
    this.initEventListeners();
  }

  getTableHeader () {
    return `<thead class="sortable-table-header" data-element="header">
      <tr class="d-flex">
        ${this.headersConfig.map(item => this.getHeaderRow(item)).join('')}
      </tr>
    </thead>`;
  }

  getHeaderRow ({id, title, sortable}) {
    const order = this.sorted.id === id ? this.sorted.order : '';

    return `
      <th class="col" data-id="${id}" data-sortable="${sortable}" data-order="${order}">
        <span>${title}</span>
      </th>
    `;
  }

  getTableBody (data) {
    return `<tbody data-element="body">
      ${
        data.length
          ? this.getTableRows(data)
          : this.getEmptyPlaceholder()
      }
    </tbody>`;
  }

  getEmptyPlaceholder () {
    return `
      <tr class="d-flex" data-element="emptyPlaceholder">
        <td class="col text-center" colspan="${this.headersConfig.length}">No products</td>
      </tr>`;
  }

  getTableRows (data) {
    const getCols = item => this.headersConfig.map(({id, template}) => {
      return template ? template(item[id]) : `<td class="col">${item[id]}</td>`;
    }).join('');

    return data.map((item = {}) => `
      <tr class="d-flex">${getCols(item)}</tr>`
    ).join('');
  }

  getTable (data) {
    return `<table class="table table-striped">
      ${this.getTableHeader()}
      ${this.getTableBody(data)}
    </table>`;
  }

  render () {
    const {id, order} = this.sorted;
    const element = document.createElement('div');
    const sortedData = this.sortData(id, order);

    element.innerHTML = this.getTable(sortedData);

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements();
  }

  sortData (field, order) {
    const arr = [...this.data];
    const column = this.headersConfig.find(item => item.id === field);
    const { sortType } = column;
    const directions = {
      asc: 1,
      desc: -1
    };
    const direction = directions[order];

    return arr.sort((a, b) => {
      switch (sortType) {
        case 'number':
        return direction * (a[field] - b[field]);
        case 'string':
        return direction * a[field].localeCompare(b[field], ['ru', 'en']);
        default:
        throw new Error(`There is no sorting algorithm for sortType: "${sortType}"`);
      }
    });
  }

  initEventListeners () {
    const { header } = this.subElements;

    header.addEventListener('pointerdown', this.onSortClick);
  }

  update (data = []) {
    this.data = data;

    const { body } = this.subElements;

    body.innerHTML = this.getTableBody(data);
  }

  add (data) {
    if (data.length) {
      this.subElements.emptyPlaceholder?.remove();
    }

    const element = document.createElement('tbody');

    this.data = [...this.data, ...data];

    element.innerHTML = this.getTableRows(data);

    this.subElements.body.append(...element.children);
  }

  dispatchEvent (type, payload) {
    this.observer.dispatchEvent({
      type,
      payload
    });
  }
}

export default connectToObserver(SortableTable);
