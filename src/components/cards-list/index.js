import Card from '../card/index.js';

import './card-list.css';

export default class CardsList {
  constructor (data = []) {
    this.data = data;
    this.render();
    this.renderCards();
  }

  getTemplate () {
    return `
      <div>
        <div class="os-products-list" data-element="body">
          <!-- Cards list -->
        </div>
      </div>
    `;
  }

  render () {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getTemplate();

    this.element = wrapper.firstElementChild;
  }

  renderCards () {
    const cards = this.getCardsList(this.data);
    const body = this.element.querySelector('[data-element="body"]');

    body.innerHTML = '';
    body.append(...cards);
  }

  update (data = []) {
    this.data = data;

    this.renderCards();
  }

  getCardsList (data = []) {
    return data.map(item => {
      const card = new Card(item);

      return card.element;
    });
  }

  add (data) {
    this.data = [...this.data, ...data];

    const body = this.element.querySelector('[data-element="body"]');
    const cards = this.getCardsList(data);

    body.append(...cards);
  }

  remove () {
    if (this.element) {
      this.element.remove();
    }
  }
}
