# dependency inversion principle

## SortableTable

| Image  |   Title   | Sales |
|--------|:---------:|:------|
| img #1 | title #1  | 10    |
| img #2 | title #2  | 5     |
| img #n | title #3  | 0     |

Example:

```js
const data = [
  {
    'image': 'https://c.dns-shop.ru/thumb/st1/fit/wm/2000/574/7ce61cca8b9ded3a0fd6f61f40621519/0e9a8ec6749df2cd904acaecd5d5c246cabb053d662f6c4c8f5bb93dceaa79d4.jpg',
    'title': '480 ГБ SSD M.2 накопитель SiliconPower M55',
    'sales': 14
  },
  {
    'image': 'https://c.dns-shop.ru/thumb/st4/fit/0/0/d7aadaab81c3d7669393353fad36144f/ad8a0488386a5de5aee95e4e1ad1d83b3d15b441e665f99f607f07518c33c680.jpg',
    'title': 'Телевизор Haier LE65K6700UG',
    'sales': 13
  },
  {
    'image': 'https://c.dns-shop.ru/thumb/st1/fit/wm/2000/1430/0042797ef4e98712cfc0e701c3107f2f/11d4bc492cd72e5be5a277e5a1acdb871d19080eb25c369d712d740afc874c47.jpg',
    'title': 'Bluetooth-стереогарнитура JBL REFLECT CONTOUR',
    'sales': 11
  },
];

class SortableTable {
  constructor (data = []) {
    this.data = data;
  }
  
  render (data) {
    /* some logic here */
  }

  sort (field = '', order = '') {
    if (field === 'image') return;
    
    const sortedData = this.sortData(field, order);

    this.render(sortedData);
  }
  
  sortData (field = '', order = '') {
    const directions = {
      asc: 1,
      desc: -1
    };

    const direction = directions[order];
    
    return [...this.data].sort((a, b) => {
      switch (field) {
        case 'sales':
          return direction * (a[field] - b[field]);
        case 'title':
          return direction * a[field].localeCompare(b[field], ['ru', 'en']);
        default:
          throw new Error(`There is no sorting algorithm for sortType: "${sortType}"`)
      }
    });
  }
}

const sortableTable = new SortableTable(headerConfig, data);

sortableTable.sort('sales', 'asc');
```


Example: 
```js
const data = [
  {
    'image': 'https://c.dns-shop.ru/thumb/st1/fit/wm/2000/574/7ce61cca8b9ded3a0fd6f61f40621519/0e9a8ec6749df2cd904acaecd5d5c246cabb053d662f6c4c8f5bb93dceaa79d4.jpg',
    'title': '480 ГБ SSD M.2 накопитель SiliconPower M55',
    'sales': 14
  },
  {
    'image': 'https://c.dns-shop.ru/thumb/st4/fit/0/0/d7aadaab81c3d7669393353fad36144f/ad8a0488386a5de5aee95e4e1ad1d83b3d15b441e665f99f607f07518c33c680.jpg',
    'title': 'Телевизор Haier LE65K6700UG',
    'sales': 13
  },
  {
    'image': 'https://c.dns-shop.ru/thumb/st1/fit/wm/2000/1430/0042797ef4e98712cfc0e701c3107f2f/11d4bc492cd72e5be5a277e5a1acdb871d19080eb25c369d712d740afc874c47.jpg',
    'title': 'Bluetooth-стереогарнитура JBL REFLECT CONTOUR',
    'sales': 11
  },
];

const config = [
  {
    id: 'image',
    title: 'Image',
    sortable: false,
  },
  {
    id: 'title',
    title: 'Name',
    sortable: true,
    sortType: 'string'
  },
  {
    id: 'sales',
    title: 'Sales',
    sortable: true,
    sortType: 'number'
  }
];

class SortableTable {
  constructor (config = [], data = []) {
    this.config = config;
    this.data = data;
  }
  
  render (data) {
    /* some logic here */
  }

  sort (field, order) {
    const sortedData = this.sortData(field, order);

    this.render(sortedData);
  }
  
  sortData (field, order) {
    const column = this.config.find(item => item.id === field);
    const { sortType } = column;
    const directions = {
      asc: 1,
      desc: -1
    };
    const direction = directions[order];

    return [...this.data].sort((a, b) => {
      switch (sortType) {
        case 'number':
          return direction * (a[field] - b[field]);
        case 'string':
          return direction * a[field].localeCompare(b[field], ['ru', 'en']);
        default:
          throw new Error(`There is no sorting algorithm for sortType: "${sortType}"`)
      }
    });
  }
}

const sortableTable = new SortableTable(headerConfig, data);

sortableTable.sort('sales', 'asc');
```

Solution:

```js
const config = [
  {
    id: 'images',
    title: 'Image'
  },
  {
    id: 'title',
    title: 'Name',
    sort (a, b) {
      return a.localeCompare(b, ['ru', 'en']);
    }
  },
  {
    id: 'sales',
    title: 'Sales',
    sort (a, b) {
      return a - b;
    }
  }
];

class SortableTable {
  constructor (headersConfig = [], data = []) {
    this.config = headersConfig;
    this.data = data;
  }

  render (data) {
    /* some logic here */
  }

  sort (field, order) {
    const sortedData = this.sortData(field, order);

    this.render(sortedData);
  }

  sortData (field, order) {
    const column = this.config.find(item => item.id === field);
    
    if (!column.sort) return;
    
    const directions = {
      asc: 1,
      desc: -1
    };
    const direction = directions[order];

    return [...this.data].sort((a, b) => {
      return direction * column.sort(a, b);
    });
  }
}
```

## Card

Example:

```js
class Card {
  data = [];
  
  constructor (url = '') {
    this.url = url;
    
    this.render();
    this.loadData();
  }
  
  render () {
    /* some logic here */  
  }
  
  async loadData () {
    try {
      const response = await fetch(this.url);
      const data = await response.json();
      
      this.data = data;
      
      this.render();
    } catch (error) {
      console.error(`Error: something went wrong ${error.message}`);
    }
  }
}
```

Solution:

```js
class Card {
  data = [];
  
  constructor (url = '', request) {
    this.url = url;
    this.request = request;
    
    this.render();
    this.loadData();
  }
  
  render () {
    /* some logic here */  
  }
  
  async loadData () {
    this.data = await this.request.get(this.url);

    this.render();
  }
}

const httpRequest = {
  async get (url) {
    try {
      const response = await fetch(urlString, options);
      const result = await response.json();

      return result;
    } catch (error) {
      throw new Error(`Error: something went wrong ${error.message}`);
    }
  }
};

const card = new Card('https://api.example.com', httpRequest);
```

Solution on module level:

```js
// request.js
export const httpRequest = {
  async get (url) {
    try {
      const response = await fetch(urlString, options);
      const result = await response.json();

      return result;
    } catch (error) {
      throw new Error(`Error: something went wrong ${error.message}`);
    }
  }
};
```

```js
// card.js
import { httpRequest } from './request.js';

export default class Card {
  data = [];

  constructor (url = '') {
    this.url = url;
    this.request = httpRequest;

    this.render();
    this.loadData();
  }

  render () {
    /* some logic here */
  }

  async loadData () {
    this.data = await this.request.get(this.url);

    this.render();
  }
}
```
