import BaseComponent from '../base-component.js';

import './card-list.css';

export default class CardsList extends BaseComponent {
  constructor ({
   CardComponent,
   data = []
 }) {
    super();

    this.CardComponent = CardComponent;
    this.data = data;
    this.render();
    this.renderCards();
  }

  get template () {
    return `
      <div class="os-products-list" data-element="body">
        <!-- Cards list -->
      </div>
    `;
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
      const card = new this.CardComponent(item);

      return card.element;
    });
  }

  add (data) {
    this.data = [...this.data, ...data];

    const cards = this.getCardsList(data);

    this.element.append(...cards);
  }
}
