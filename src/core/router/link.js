import Router from './index.js';

export default class Link {
  static activeClassName = 'active';

  onPopState = () => {
    if (`/${this.router.strippedPath}` === this.url) {
      this.element.classList.add(Link.activeClassName);
    } else {
      this.element.classList.remove(Link.activeClassName);
    }
  };

  constructor({
    url = '',
    html = '',
    attributes = {}
  } = {}) {
    this.url = url;
    this.html = html;
    this.attributes = attributes;
    this.router = Router.instance;

    this.render();
    this.initEventListens();
  }

  render () {
    const element = document.createElement('a');

    element.setAttribute('href', this.url);
    element.innerHTML = this.html;

    for (const [prop, value] of Object.entries(this.attributes)) {
      element.setAttribute(prop, value);
    }

    this.element = element;
  }

  initEventListens () {
    this.element.addEventListener('click', event => {
      event.preventDefault();

      const href = event.currentTarget.getAttribute('href');

      this.router.navigate(href);
    });

    window.addEventListener('popstate', this.onPopState);
  }

  remove () {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy () {
    this.remove();
    this.element = null;
    window.removeEventListener('popstate', this.onPopState);
  }
}
