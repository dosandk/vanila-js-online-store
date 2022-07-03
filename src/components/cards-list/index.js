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
      <div class="os-products-list" data-element="body">
        <!-- Cards list -->
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

    this.element.innerHTML = '';
    this.element.append(...cards);
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

    const cards = this.getCardsList(data);

    this.element.append(...cards);
  }

  remove () {
    if (this.element) {
      this.element.remove();
    }
  }
}
