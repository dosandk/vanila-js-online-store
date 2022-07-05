import {createElement, getSubElements} from '../../core/dom/index.js';
import connectToObserver from "../../core/observer/connect.js";
import connectToStore from "../../core/store/connect.js";
import {
  addProduct,
  removeProduct
} from '../../reducers/products.js';
import {
  addToWishList as addToWishListAction,
  removeFromWishList
} from '../../reducers/wishlist.js';

import './card.css';

class Card {
  subElements = {};

  constructor(product = {}, store, observer) {
    this.product = product;
    this.store = store;
    this.observer = observer;

    const { products, wishlist } = this.store.getState();

    this.cartProducts = products.map(product => product.id);
    this.wishlist = wishlist.map(product => product.id);

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
      <button class="os-btn-default add-to-wishlist-btn ${this.isActive(this.wishlist)}" data-element="addToWishlist">
        <i class="bi bi-heart"></i>
        <i class="bi bi-heart-fill"></i>
        Wishlist
      </button>
      <div class="btns-separator"></div>
      <button class="os-btn-default add-to-cart-btn ${this.isActive(this.cartProducts)}" data-element="addToCart">
        <i class="bi bi-cart"></i>
        <i class="bi bi-cart-check-fill"></i>
        Cart
      </button>
    </footer>`;
  }

  isActive (selected) {
    return selected.includes(this.product.id) ? 'active' : '';
  }

  initEventListeners() {
    const {addToWishlist, addToCart} = this.subElements;

    addToWishlist.addEventListener('pointerdown', event => {
      const status = event.currentTarget.classList.toggle('active');

      this.dispatchEvent('add-to-wishlist', {
        product: this.product,
        status
      });

      if (status) {
        this.addProduct('wishList');
      } else {
        this.removeProduct('wishList');
      }
    });

    addToCart.addEventListener('pointerdown', event => {
      const status = event.currentTarget.classList.toggle('active');

      this.dispatchEvent('add-to-cart', {
        product: this.product,
        status
      });

      if (status) {
        this.addProduct('cartList');
      } else {
        this.removeProduct('cartList');
      }
    });
  }

  addProduct (actionName = '') {
    const actions = {
      wishList: addToWishListAction,
      cartList: addProduct
    };

    this.store.dispatch(actions[actionName](this.product));
  }

  removeProduct (actionName = '') {
    const actions = {
      wishList: removeFromWishList,
      cartList: removeProduct
    };

    this.store.dispatch(actions[actionName](this.product));
  }

  dispatchEvent(type = '', payload = {}) {
    this.observer.dispatchEvent({type, payload});
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
