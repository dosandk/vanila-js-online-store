import BaseComponent from '../../../components/base-component.js';
import Card from '../../../components/card/index.js';

import './wish-card.css';

class WishCard extends Card {
  constructor(...props) {
    super(...props);
  }
  get footer () {
    return '';
  }
  initEventListeners () {}
}

export default class WishCardWrapper extends BaseComponent {
  constructor(product) {
    super();

    this.product = product;
    this.wishCard = new WishCard(this.product);

    this.render();
    this.initEventListeners();
  }

  get template () {
    return `
      <div class="wish-card-container">
        <div class="close-btn" data-element="closeBtn">
          <i class="bi bi-x"></i>
        </div>
        <div data-element="card">
          <!-- Card component -->
        </div>
      </div>
    `;
  }

  render () {
    super.render();

    this.subElements.card.append(this.wishCard.element);
  }


  initEventListeners () {
    const { closeBtn } = this.subElements;

    closeBtn.addEventListener('pointerdown', () => {
      this.wishCard.removeProduct('wishList');
    });
  }
}
