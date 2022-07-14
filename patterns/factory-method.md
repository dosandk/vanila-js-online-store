# Factory Method

```mermaid
flowchart LR
  A[Component] -- factoryMethod --> B[Factory] -- new --> C[Object]
```

Example:

```js
class SuccessNotification {}

class ErrorNotification {}

class InfoNotification {}

class Component {
  factoryMethod (type = '') {
    const notificationTypes = {
      succes: SuccessNotification,
      error: ErrorNotification,
      info: InfoNotification
    };
    
    const notification = new notificationTypes[type];
    
    return notification;
  }
}
```
