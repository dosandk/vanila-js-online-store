import {debounce} from './debounce.js';
import connectToObserver from '../../core/observer/connect.js';

import './search.css';

class Search {
  element;
  subElements = {};
  delay = 300;

  onKeyUp = debounce(event => {
    const title = event.target.value.trim();

    this.dispatchEvent(title);
  }, this.delay);

  constructor(observer) {
    this.observer = observer;

    this.initialize();
  }

  initialize() {
    this.render();
    this.getSubElements();
    this.addEventListeners();
  }

  get template() {
    return `
      <form>
        <div class="os-form-input use-icon">
          <input id="search-input"
            type="text"
            data-element="search"
            placeholder="Search">
          <label class="bi bi-search input-icon"
            for="search-input"></label>
        </div>
      </form>
    `;
  }

  render() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.template;

    this.element = wrapper.firstElementChild;
  }

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    this.subElements = result;
  }

  dispatchEvent(searchString = '') {
    this.observer.dispatchEvent({
      type: 'search-filter',
      payload: searchString
    });
  }

  addEventListeners() {
    this.subElements.search.addEventListener('input', this.onKeyUp);
  }

  clear() {
    this.element.reset();
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}

export default connectToObserver(Search);
