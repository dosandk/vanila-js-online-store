import { DOM, createElement, addEventListener, removeEventListener } from '../../core/dom/index.js';
import connectToObserver from '../../core/observer/connect.js';

class InfinityList {
  loading = false;

  onWindowScroll = () => {
    const { bottom } = this.element.getBoundingClientRect();
    const threshold = 100;

    if (bottom - threshold < document.documentElement.clientHeight && !this.loading) {
      this.start = this.end;
      this.end = this.start + this.step;

      this.loading = true;

      this.dispatchEvent('load-data', {
        start: this.start,
        end: this.end
      });
    }
  };

  constructor (
    list = {},
    {
      step = 20,
    } = {},
    observer
  ) {
    this.list = list;
    this.step = step;
    this.start = 1;
    this.end = this.start + step;

    this.observer = observer;

    this.initialize();
  }

  // NOTE: Pattern. Facade
  initialize () {
    this.render();
    this.initEventListeners();
  }

  render () {
    this.element = createElement();
    this.element.append(this.list.element);
  }

  add (data) {
    this.list.add(data);
    this.loading = false;
  }

  update (data) {
    this.list.update(data);
    this.loading = false;
  }

  resetPagination () {
    this.start = 1;
    this.end = this.start + this.step;
  }

  dispatchEvent (type = '', payload) {
    this.observer.dispatchEvent({
      type,
      payload
    });
  }

  initEventListeners () {
    addEventListener(DOM.document, 'scroll', this.onWindowScroll);
  }

  remove () {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy () {
    this.remove();
    this.element = null;
    this.list = null;
    this.loading = false;

    removeEventListener(DOM.document, 'scroll', this.onWindowScroll);
  }
}

export default connectToObserver(InfinityList);
