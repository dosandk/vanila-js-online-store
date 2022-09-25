class BaseComponent {
  element = {};
  subElements = {};
  abortController = new AbortController();

  constructor() {
    if (new.target === BaseComponent) {
      throw new TypeError('Cannot construct Abstract instances directly');
    }
  }

  render () {
    this.element = this.createElement();
    this.subElements = this.getSubElements();
  }

  get template () {
    return '';
  }

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
  }

  createElement = () => {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.template;

    return wrapper.firstElementChild || wrapper;
  };

  remove () {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy () {
    this.remove();
    this.element = {};
    this.subElements = {};

    this.abortController.abort();
  }
}

export default BaseComponent;
