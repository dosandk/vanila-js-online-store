export default class Card {
  constructor (product = {}) {
    this.product = product;
    this.render();
  }

  getTemplate () {
    const result =  `
      <div class="os-product-card">
        <div class="os-product-img" style="background-image: url(${this.product.images[0].url});"></div>

        <div class="os-product-content">
          <div class="os-product-price-wrapper">
            <div class="os-product-rating">
              <span>${this.product.rating}</span>
              <i class="bi bi-star"></i>
            </div>

            <div class="os-product-price">${this.product.price} USD</div>
          </div>

          <h5 class="os-product-title">${this.product.title}</h5>
          <p class="os-product-description">${this.product.description.slice(0, 50) + '...'}</p>
        </div>

        <footer class="os-product-footer">
          <button class="os-btn-default">
            <i class="bi bi-heart"></i>
            Wishlist
          </button>

          <button class="os-btn-primary" data-element="addToCartBtn">
            <i class="bi bi-box-seam"></i>
            Add To Cart
          </button>
        </footer>
      </div>
    `;

    return result
  }

  update(data = {}) {
    this.state = data;
    this.element.innerHTML = this.getTemplate();
  }

  render () {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getTemplate();

    this.element = wrapper.firstElementChild;
  }

  remove () {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy () {
    this.remove();
    this.element = null;
  }
}
