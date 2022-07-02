import { renderPage } from './render-page.js';

export default class Router {
  static #instance;

  static get instance() {
    if (Router.#instance) {
      return Router.#instance;
    }

    return new Router();
  }

  routes = [];

  // NOTE: Pattern: Singleton
  constructor() {
    if (Router.#instance) {
      return Router.#instance;
    }

    Router.#instance = this;
  }

  get strippedPath () {
    return decodeURI(window.location.pathname)
      // NOTE: clear slashed at the start and at the end: '///foo/bar//' -> 'foo/bar'
      .replace(/^\/+|\/+$/g, '')
      // NOTE: clear slash duplicates inside route: 'foo///bar' -> 'foo/bar'
      .replace(/\/{2,}/g, '/');
  }

  async route() {
    let match;

    for (let route of this.routes) {
      match = this.strippedPath.match(route.pattern);

      if (match) {
        this.page = await this.changePage(route.path, match);
        break;
      }
    }

    if (!match) {
      this.page = await this.changePage('error404');
    }
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
