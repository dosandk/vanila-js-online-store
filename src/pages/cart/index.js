import { getSubElements } from '../../core/dom/index.js';
import connectToStore from '../../core/store/connect.js';
import sortableTableHeaderConfig from './sortable-table-wishlist-header.js';
import SortableTable from "../../components/sortable-table/index.js";
import InfinityList from "../../components/infinity-list/index.js";
import NotificationManager from "../../components/notification/notification-manager";

class CartPage {
  subElements = {};
  components = {};
  subscriptions = [];

  constructor (match, observer) {
    this.observer = observer;

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
        <h1>This is Cart Page</h1>
        <div data-element="list">

        </div>
      </div>
    `;
  }

  initComponents () {
    const sortableTable = new SortableTable(sortableTableHeaderConfig, {
      data: []
    });

    const list = new InfinityList(sortableTable, { step: this.step });

    this.notificationManager = new NotificationManager();

    this.components = {
      list
    };
  }

  renderComponents () {

  }

  render () {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getTemplate();

    this.element = wrapper.firstElementChild;

    this.subElements = getSubElements(this.element);
  }

  initEventListeners () {

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

    for (const unsubscribe of this.subscriptions) {
      unsubscribe();
    }

    this.element = null;
    this.components = null;
    this.subElements = null;
  }
}

// NOTE: Pattern. Decorator
export default connectToStore(CartPage);
