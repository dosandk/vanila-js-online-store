import BaseComponent from '../base-component.js';
import connectToObserver from '../../core/observer/connect.js';

class InfinityList extends BaseComponent {
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
    super();

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
    super.render();

    this.element.classList.add('infinity-container');
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
    document.addEventListener('scroll', this.onWindowScroll, {
      signal: this.abortController.signal
    });
  }

  destroy () {
    super.destroy();

    this.list = null;
    this.loading = false;
  }
}

export default connectToObserver(InfinityList);
