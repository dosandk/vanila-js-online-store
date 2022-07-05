import './card-list.css';

export default class CardsList {
  constructor ({
   CardComponent,
   data = []
 }) {
    this.CardComponent = CardComponent;
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
      const card = new this.CardComponent(item);

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
