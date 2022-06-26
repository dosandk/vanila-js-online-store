import Card from './index.js';
import { products } from '../../fixtures/products';

describe('card', () => {
  let card;

  beforeEach(() => {
    card = new Card(products[0]);

    document.body.append(card.element);
  });

  afterEach(() => {
    card.destroy();
    card = null;
  });

  it('should be rendered correctly', () => {
    expect(card.element).toBeInTheDocument();
    expect(card.element).toBeVisible();
  });

  it('should have ability to be removed', () => {
    card.remove();

    expect(card.element).not.toBeInTheDocument();
  });
});

