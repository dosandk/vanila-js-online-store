import Card from '../../../components/card/index.js';
import { getSubElements } from '../../../core/dom/index.js';

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

export default class WishCardWrapper {
  constructor(product) {
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
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.template;

    this.element = wrapper.firstElementChild;

    this.subElements = getSubElements(this.element);

    this.subElements.card.append(this.wishCard.element);
  }


  initEventListeners () {
    this.subElements.closeBtn.addEventListener('pointerdown', () => {
      this.wishCard.removeProduct('wishList');
    });
  }
}
