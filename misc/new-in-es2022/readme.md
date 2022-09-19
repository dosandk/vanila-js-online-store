# New in ECMAScript 2022 

## Method `.at()` of indexable values

```js
const arr = ['a', 'b', 'c'];
const arrayOfArrays = [['a'], ['b'], ['c', 'd']];

arr.at(1); // 'b'
arr.at(-1); // 'c'

const string = 'abc';

string.at(1); // 'b'
string.at(-1); // 'c'

arrayOfArrays.at(-1).at(-1); // ✅ 'd'
arrayOfArrays[arrayOfArrays.length - 1][arrayOfArrays[arrayOfArrays.length - 1].length - 1]; // 🔴 'd'
```

## `Object.hasOwn(obj, propKey)`

```js
const obj = Object.create(null);

obj.color = 'yellow';

obj.hasOwnProperty('color'); // 🔴 Uncaught TypeError: obj.hasOwnProperty is not a function
Object.hasOwn(obj, 'color'); // ✅ false
```

## Top-level `await` in modules:

```html
<script type="module">
  const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
</script>
```

## `error.cause`

```js
new Error('Something went wrong', { cause: otherError });
```


## Static public fields and methods

```js
class Component {
  static counter = 0;
  static logCounter = () => {
    console.log(Component.counter);
  };
  
  data = [];
}
```

## Instance private fields

```js
class Component {
  #data = [];
}
```

## Static initialization blocks in classes

```js
class Component {
  static #counter = 0;
  static getCounter = () => Component.#counter;
  static {
    Component.#counter += 1;
  }
}
```

# New in ECMAScript 2020

## Dynamic imports via import()

```js
const { default: Page } = await import(`../../pages/${path}/index.js`);
```

## Optional chaining for property accesses and method calls.

```js
const obj = {
  color: 'yellow'
};

obj?.color; // 'yellow'
obj?.color?.foo?.bar; // undefined
```

## Nullish coalescing operator (??)

```js
value ?? defaultValue;
```

## Bigints

```js
typeof 1n; // 'bigint'
```

## Promise.allSettled()

```js
Promise.allSettled([
  Promise.resolve('a'),
  Promise.reject('b'),
])
.then(data => {
  console.log(data);
})
```
