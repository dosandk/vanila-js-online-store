import { renderPage } from './render-page.js';

// performs routing on all links
export default class Router {
  static #instance;

  static get instance() {
    if (Router.#instance) {
      return Router.#instance;
    }

    return new Router();
  }

  static set instance (context) {
    Router.#instance = context;
  }

  routes = [];

  // NOTE: Pattern: Singleton
  constructor() {
    if (Router.#instance) {
      return Router.#instance;
    }

    this.initEventListeners();

    Router.instance = this;
  }

  initEventListeners () {
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');

      if (href && href.startsWith('/')) {
        event.preventDefault();
        this.navigate(href);
      }
    });
  }

  async route() {
    let strippedPath = decodeURI(window.location.pathname)
      .replace(/^\/|\/$/, '');

    let match;

    for (let route of this.routes) {
      match = strippedPath.match(route.pattern);

      if (match) {
        this.page = await this.changePage(route.path, match);
        break;
      }
    }

    if (!match) {
      this.page = await this.changePage('error404');
    }

    // TODO: maybe remove this event?
    // document.dispatchEvent(new CustomEvent('route', {
    //   detail: {
    //     page: this.page
    //   }
    // }));
  }

  async changePage (path, match) {
    if (this.page && this.page.destroy) {
      this.page.destroy();
    }

    return await renderPage(path, match);
  }

  navigate (path) {
    history.pushState(null, null, path);
    this.route();
  }

  addRoute (pattern, path) {
    this.routes.push({pattern, path});
    return this;
  }

  listen () {
    window.addEventListener('popstate', () => this.route());
    this.route();
  }
}
