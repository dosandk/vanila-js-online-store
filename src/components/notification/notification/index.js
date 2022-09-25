import './notification.css';

// NOTE: Pattern. Abstract factory
export default class NotificationMessage {
  duration = 2000;

  static create (type = '', message = '') {
    const notifications = {
      success: SuccessNotificationMessage,
      error: ErrorNotificationMessage,
      info: InfoNotificationMessage
    };

    return new notifications[type](message);
  }

  // NOTE: abstract class
  constructor() {
    if (new.target === NotificationMessage) {
      throw new TypeError('Cannot construct Abstract instances directly');
    }
  }

  // NOTE: abstract method
  get template () {}

  render () {
    const element = document.createElement('div');

    element.innerHTML = this.template;

    this.element = element.firstElementChild || element;
  }

  show (root = document.body) {
    root.append(this.element);

    this.timerId = setTimeout(() => {
      this.remove();
    }, this.duration);
  }

  remove () {
    clearTimeout(this.timerId);

    if (this.element) {
      this.element.remove();
    }
  }

  destroy () {
    this.remove();
  }
}

// NOTE: keep export for tests
export class SuccessNotificationMessage extends NotificationMessage {
  constructor(message = '') {
    super();

    this.message = message;
    this.render();
  }

  get template () {
    return `<div class="notification success" style="--value:${this.duration + 'ms'}">
      <div class="timer"></div>
      <div class="inner-wrapper">
        <div class="notification-body">
          <i class="bi bi-check-circle"></i>
          ${this.message}
        </div>
      </div>
    </div>`;
  }
}

class ErrorNotificationMessage extends NotificationMessage {
  constructor(message) {
    super();

    this.message = message;
    this.render();
    this.addEventListeners();
  }

  get template () {
    return `<div class="notification error">
      <div class="inner-wrapper">
        <i class="bi bi-x close-btn" data-element="close"></i>
        <div class="notification-body">
          <i class="bi bi-exclamation-triangle"></i>
          ${this.message}
        </div>
      </div>
    </div>`;
  }

  addEventListeners () {
    const closeBtn = this.element.querySelector("[data-element='close']");

    closeBtn.addEventListener('click', () => {
      this.remove();
    });
  }

  show (root = document.body) {
    root.append(this.element);
  }
}

class InfoNotificationMessage extends NotificationMessage {
  constructor(message = '') {
    super();

    this.message = message;
    this.render();
  }

  get template () {
    return `<div class="notification info" style="--value:${this.duration + 'ms'}">
      <div class="timer"></div>
      <div class="inner-wrapper">
        <div class="notification-body">
          <i class="bi bi-info-circle"></i>
          ${this.message}
        </div>
      </div>
    </div>`;
  }
}
