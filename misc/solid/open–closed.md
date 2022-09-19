# open–closed principle

Example:

```js
class Card {
  constructor ({
    title = '',
    total = 0,
    formatTotal = data => data
  } = {}) {
    this.title = title;
    this.total = formatTotal(total);
    
    this.render();
  }
  
  get template () {
    return `
      <div>
        <h1>${this.title}</h1>
        <div>
          Total: ${this.total}
        </div>
      </div>
    `;
  }
  
  render () {
    this.element = document.createElement('div');
    this.element.innerHTML = this.template;
  }
}

const card = new Card({ 
  title: 'Our clients',
  total: 301,
  formatTotal: data => `Total clients ${data}`
});

const card = new Card({
  title: 'Our sales',
  total: 15600,
  formatTotal: data => `${data} USD`
});
```
