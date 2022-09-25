import BaseComponent from '../../components/base-component.js';

import './error404.css';

export default class Page404 extends BaseComponent {
  constructor() {
    super();
    this.render();
  }

  get template() {
    return `
      <div class='error404'>
        <h1 class='error404-title'>404</h1>
        <h2>Page not found</h2>
      </div>
    `;
  }
}
