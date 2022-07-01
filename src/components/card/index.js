import {createElement, getSubElements} from '../../core/dom/index.js';
import connectToObserver from "../../core/observer/connect.js";
import connectToStore from "../../core/store/connect.js";
import { addProduct } from '../../reducers/products.js';

import './card.css';

class Card {
  subElements = {};

  constructor(product = {}, store, observer) {
    this.product = product;
    this.store = store;
    this.observer = observer;

    this.render();
    this.initEventListeners();
  }

  get template() {
    const {images, rating, price, title, description} = this.product;

    return `
      <div class="os-product-card">
        <div class="os-product-img" style="background-image: url(${images[0].url});"></div>

        <div class="os-product-content">
          <div class="os-product-price-wrapper">
            <div class="os-product-rating">
              <span>${rating}</span>
              <i class="bi bi-star"></i>
            </div>

            <div class="os-product-price">${price} USD</div>
          </div>

          <h5 class="os-product-title">${title}</h5>
          <p class="os-product-description">${description.slice(0, 50) + '...'}</p>
        </div>
        ${this.footer}
      </div>
    `;
  }

  get footer() {
    return `<footer class="os-product-footer">
      <button class="os-btn-default" data-element="addToWishlist">
        <i class="bi bi-heart"></i>
        Wishlist
      </button>

      <button class="os-btn-primary" data-element="addToCart">
        <i class="bi bi-box-seam"></i>
        Add To Cart
      </button>
    </footer>`;
  }

  initEventListeners() {
    const {addToWishlist, addToCart} = this.subElements;

    addToWishlist.addEventListener('pointerdown', () => {
      // TODO: implement saving in browser storage
    });

    addToCart.addEventListener('pointerdown', () => {
      this.store.dispatch(addProduct(this.product));
    });
  }

  dispatchEvent(type = '') {
    this.observer.dispatchEvent({type});
  }

  update(product = {}) {
    this.product = product;
    this.element.innerHTML = this.template;
  }

  render() {
    this.element = createElement(this.template);
    this.subElements = getSubElements(this.element);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}

export default connectToStore(connectToObserver(Card));
