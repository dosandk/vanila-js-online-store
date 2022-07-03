import NotificationMessage from '../notification/index.js';

import './style.css';

export default class NotificationManager {
  notificationsList = [];

  // NOTE: Pattern: Singleton
  constructor ({ stackLimit = 3} = {}) {
    if (NotificationManager.instance) {
      return NotificationManager.instance;
    }

    this.stackLimit = stackLimit;

    NotificationManager.instance = this;

    this.render();
  }


  render () {
    this.element = document.createElement('div');
    this.element.className = 'notifications-container';

    document.body.append(this.element);
  }

  show (message = '', type = '') {
    // NOTE: Pattern. Factory method
    const notification = NotificationMessage.create(type, message);

    notification.show(this.element);

    if (this.notificationsList.length >= this.stackLimit) {
      this.removeOldMessage();
    }

    this.notificationsList.push(notification);

    // NOTE: Keep this example
    // if (notification.name !== 'ErrorNotificationMessage') {
    //   this.notificationsList.push(notification);
    // }
  }

  removeOldMessage () {
    const notification = this.notificationsList.shift();

    notification.remove();
  }

  destroy () {
    for (const notification of this.notificationsList) {
      notification.destroy();
    }

    this.notificationsList = [];

    NotificationManager.instance = null;
  }
}
