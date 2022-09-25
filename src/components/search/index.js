import BaseComponent from '../base-component.js';
import connectToObserver from '../../core/observer/connect.js';
import {debounce} from './debounce.js';

import './search.css';

class Search extends BaseComponent {
  element;
  subElements = {};
  delay = 300;

  onKeyUp = debounce(event => {
    const title = event.target.value.trim();

    this.dispatchEvent(title);
  }, this.delay);

  constructor(observer) {
    super();

    this.observer = observer;

    this.render();
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
}

export default connectToObserver(Search);
