import './error404.css';

export default class Page404 {
  constructor() {
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

  render () {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.template;

    this.element = wrapper.firstElementChild;
  }
}
