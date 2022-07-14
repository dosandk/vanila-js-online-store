# Abstract Factory

```mermaid
flowchart TB
  A[Abstract Factory] -- create --> B[Concrete Factory]
  B -- new --> C[Product 1]
  B -- new --> D[Product 2]
  B -- new --> E[Product 3]
  
```

Example:

```js
class SuccessNotification {}

class ErrorNotification {}

class InfoNotification {}

class Component {
  static create (type = '') {
    const notificationTypes = {
      succes: SuccessNotification,
      error: ErrorNotification,
      info: InfoNotification
    };
    
    return notificationTypes[type];
  }
}

const SuccessNotification = Component.create('success');

const success1 = new SuccessNotification();
const success2 = new SuccessNotification();
const success3 = new SuccessNotification();

const ErrorNotification = Component.create('error');

const error1 = new ErrorNotification();
const error1 = new ErrorNotification();
```
