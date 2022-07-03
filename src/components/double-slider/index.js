import connectToObserver from '../../core/observer/connect.js';

import './double-slider-style.css';

class DoubleSlider {
  element;
  subElements = {};

  onThumbPointerMove = event => {
    const { left: innerLeft, right: innerRight, width } = this.subElements.inner.getBoundingClientRect();

    if (this.dragging === this.subElements.thumbLeft) {
      let newLeft = (event.clientX - innerLeft + this.shiftX) / width;

      if (newLeft < 0) {
        newLeft = 0;
      }
      newLeft *= 100;

      const right = parseFloat(this.subElements.thumbRight.style.right);

      if (newLeft + right > 100) {
        newLeft = 100 - right;
      }

      this.dragging.style.left = this.subElements.progress.style.left = newLeft + '%';
      this.subElements.from.innerHTML = this.formatValue(this.getValue().from);
    }

    if (this.dragging === this.subElements.thumbRight) {
      let newRight = (innerRight - event.clientX - this.shiftX) / width;

      if (newRight < 0) {
        newRight = 0;
      }
      newRight *= 100;

      const left = parseFloat(this.subElements.thumbLeft.style.left);

      if (left + newRight > 100) {
        newRight = 100 - left;
      }

      this.dragging.style.right = this.subElements.progress.style.right = newRight + '%';
      this.subElements.to.innerHTML = this.formatValue(this.getValue().to);
    }
  };

  onThumbPointerUp = () => {
    this.element.classList.remove('range-slider_dragging');

    document.removeEventListener('pointermove', this.onThumbPointerMove);
    document.removeEventListener('pointerup', this.onThumbPointerUp);

    this.observer.dispatchEvent({
      type: 'range-selected',
      payload: this.getValue()
    });
  };

  constructor({
    min = 100,
    max = 200,
    formatValue = value => value,
    selected = {
      from: min,
      to: max
    },
    precision = 0,
  } = {}, observer) {
    this.min = min;
    this.max = max;
    this.formatValue = formatValue;
    this.selected = selected;
    this.precision = 10 ** precision;

    this.observer = observer;

    this.render();
  }

  get template() {
    const { from, to } = this.selected;

    return `<div class="range-slider">
      <span data-element="from">${this.formatValue(from)}</span>
      <div data-element="inner" class="range-slider__inner">
        <span data-element="progress" class="range-slider__progress"></span>
        <span data-element="thumbLeft" class="range-slider__thumb-left">
          <svg width="6" height="18" viewBox="0 0 6 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.959114 4.55246L4.65304 0.992556C4.97059 0.686527 5.5 0.911567 5.5 1.35258V16.9297C5.5 17.3481 5.01686 17.5815 4.68917 17.3214L1.06751 14.4471C0.708988 14.1625 0.5 13.7298 0.5 13.2721V5.63253C0.5 5.2251 0.66574 4.83519 0.959114 4.55246Z" fill="white" stroke="#C2CFE0"/>
          </svg>
        </span>
        <span data-element="thumbRight" class="range-slider__thumb-right">
          <svg width="6" height="18" viewBox="0 0 6 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.959114 4.55246L4.65304 0.992556C4.97059 0.686527 5.5 0.911567 5.5 1.35258V16.9297C5.5 17.3481 5.01686 17.5815 4.68917 17.3214L1.06751 14.4471C0.708988 14.1625 0.5 13.7298 0.5 13.2721V5.63253C0.5 5.2251 0.66574 4.83519 0.959114 4.55246Z" fill="white" stroke="#C2CFE0"/>
          </svg>
        </span>
      </div>
      <span data-element="to">${this.formatValue(to)}</span>
    </div>`;
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = this.template;

    this.element = element.firstElementChild;
    this.element.ondragstart = () => false;

    this.subElements = this.getSubElements(element);

    this.initEventListeners();

    this.update();
  }

  initEventListeners() {
    const { thumbLeft, thumbRight } = this.subElements;

    thumbLeft.addEventListener('pointerdown', event => this.onThumbPointerDown(event));
    thumbRight.addEventListener('pointerdown', event => this.onThumbPointerDown(event));
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    document.removeEventListener('pointermove', this.onThumbPointerMove);
    document.removeEventListener('pointerup', this.onThumbPointerUp);
  }

  update(from = this.selected.from, to = this.selected.to) {
    const rangeTotal = this.max - this.min;
    const left = Math.floor((from - this.min) / rangeTotal * 100) + '%';
    const right = Math.floor((this.max - to) / rangeTotal * 100) + '%';

    this.subElements.progress.style.left = left;
    this.subElements.progress.style.right = right;

    this.subElements.thumbLeft.style.left = left;
    this.subElements.thumbRight.style.right = right;

    this.subElements.from.innerText = this.formatValue(from);
    this.subElements.to.innerText = this.formatValue(to);
  }

  onThumbPointerDown(event) {
    const thumbElem = event.target.closest('span');

    if (!thumbElem) return;

    event.preventDefault();

    const { left, right } = thumbElem.getBoundingClientRect();

    if (thumbElem === this.subElements.thumbLeft) {
      this.shiftX = right - event.clientX;
    } else {
      this.shiftX = left - event.clientX;
    }

    this.dragging = thumbElem;

    this.element.classList.add('range-slider_dragging');

    document.addEventListener('pointermove', this.onThumbPointerMove);
    document.addEventListener('pointerup', this.onThumbPointerUp);
  }

  getValue() {
    const rangeTotal = this.max - this.min;
    const { left } = this.subElements.thumbLeft.style;
    const { right } = this.subElements.thumbRight.style;

    const leftShift = parseFloat(left) * rangeTotal / 100;
    const rightShift = parseFloat(right) * rangeTotal / 100;

    const from = Math.round((this.min + leftShift) * this.precision) / this.precision;
    const to = Math.round((this.max - rightShift) * this.precision) / this.precision;

    return { from, to };
  }

  reset () {
    this.selected = {
      from: this.min,
      to: this.max
    };

    this.update();
  }
}

export default connectToObserver(DoubleSlider);
