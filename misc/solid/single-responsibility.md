# single-responsibility principle

Problem:

```js
class Card {
  total = 0;
  
  constructor ({
    title = '',
    formatTotal = data => data
  } = {}) {
    this.title = title;
    this.formatTotal = formatTotal;
    
    this.loadData();
    this.render();
  }
  
  get template () {
    return `
      <div>
        <h1>${this.title}</h1>
        <div>
          Total: <span id="totalContainer">${this.total}</span> 
        </div>
      </div>
    `;
  }
  
  async loadData () {
    try {
      const response = await fetch('https:/api.some-endpoint/total');
      const data = await response.json();

      this.saveToBrowserCache(data);
      
      const totalContainer = document.getElementById('totalContainer');

      totalContainer.innerHTML = this.formatTotal(data);
    } catch (error) {
      console.error('Error: something went wrong');
    }
  }
  
  saveToBrowserCache (data) {
    localStorage.setItem('cardData', data);
  }
  
  render () {
    this.element = document.createElement('div');
    this.element.innerHTML = this.template;
  }
}
```

Solution:

```js
class CacheManager {
  saveToBrowserCache (data) {
    localStorage.setItem('cardData', data);
  }
}

const cacheManager = new CacheManager();

class Logger {
  log (...args) {
    console.log.apply(console, args);
  }
  warn (...args) {
    console.warn.apply(console.log, args);
  }
  error (...args) {
    console.error.apply(console.log, args);
  }
}

const logger = new Logger();

class RequestsManager {
  async request (url) {
    try {
      const response = await fetch(url);
      const data = await response.json();

      return data;
    } catch (error) {
      logger.log(error);
      
      throw new Error(`Error: data loading error ${error.message}`);
    }
  }
}

const requestManager = new RequestsManager();

class Card {
  total = 0;

  constructor ({
   title = '',
   formatTotal = data => data
  } = {}) {
    this.title = title;
    this.formatTotal = formatTotal;

    this.render();
    this.update();
  }

  get template () {
    return `
      <div>
        <h1>${this.title}</h1>
        <div>
          Total: <span id="totalContainer">${this.total}</span> 
        </div>
      </div>
    `;
  }

  async update () {
    const data = await requestManager.request('https:/api.some-endpoint/total')

    cacheManager.saveToBrowserCache(data);
    this.renderTotal(data);
  }

  renderTotal (data) {
    const totalContainer = document.getElementById('totalContainer');

    totalContainer.innerHTML = this.formatTotal(data);
  }

  render () {
    this.element = document.createElement('div');
    this.element.innerHTML = this.template;
  }
}
```
