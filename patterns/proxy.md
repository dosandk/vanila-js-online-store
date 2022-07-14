# Proxy

```mermaid
flowchart LR
  Client -- "request()" --> Proxy -- "request()" --> RealSubject
```

Example:

JavaScript native implementation with "Proxy" object

```js
const user = {
  nickname: 'John'
};

const proxyUser = new Proxy(user, {
  get(target, prop, receiver) {
    if (prop in target) {
      return Reflect.get(target, prop, receiver);
    } else {
      throw new ReferenceError(`There is no propery: "${prop}"`)
    }
  }
});

proxyUser.foo // Uncaught ReferenceError: There is no propery: "foo"
```

Implementation via class

```js
// request.js
class Proxy {
  proxyCache = new Map();

  constructor(obj, {
    maxSize = 10
  } = {}) {
    this.obj = obj;
    this.maxSize = maxSize;
  }

  set (key = '', value) {
    if (this.proxyCache.size === this.maxSize) {
      const oldestKey = [...this.proxyCache.keys()].shift();

      this.proxyCache.delete(oldestKey);
    }

    this.proxyCache.set(key, value);
  }

  async get (key, options) {
    if (this.proxyCache.has(key)) {
      return this.proxyCache.get(key);
    }
    
    const result = await this.obj.get(key, options);

    this.set(key, result);
    
    return result;
  }
}

const httpRequest = {
  async get(url = '', options = {}) {
    try {
      const urlString = url.toString();
      const response = await fetch(urlString, options);
      const result = await response.json();

      return result;
    } catch (error) {
      console.error(`Request error, ${error.message}`);  
    }
  }
};

const proxyHttpRequest = new Proxy(httpRequest, { maxSize: 10 });

proxyHttpRequest.get('url-1'); // Request to server and resposne
proxyHttpRequest.get('url-1'); // Request to cache and response
```
