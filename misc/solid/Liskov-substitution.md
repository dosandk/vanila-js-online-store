# Liskov substitution principle

Example #1

```js
class Rectangle {
  setWidth(width = 0) {
    this.width = width;
  }

  setHeight(height = 0) {
    this.height = height;
  }

  getArea() {
    return this.width * this.height;
  }
}

class Square extends Rectangle {
  setSize(size = 0) {
    this.width = size;
    this.height = size;
  }
}

const rectangle = new Rectangle();

rectangle.setWidth(5);
rectangle.setHeight(2);

console.assert(rectangle.getArea() === 10, 'area should be equal to 10');

const square = new Square();

rectangle.setWidth(5);
rectangle.setHeight(2);

console.assert(rectangle.getArea() === 10, 'area should be equal to 10');
```

Solution:

```js
class Shape {
  getArea() {
    return this.widht * this.height;
  }
}

class Rectangle extends Shape {
  setWidth(width = 0) {
    this.widht = width;
  }
  setHeight(height = 0) {
    this.height = height;
  }
}

class Square extends Figure {
  setSize (size = 0) {
    this.width = size;
    this.height = size;
  }
}
```

TODO: Duck, SmokingDuck, RoboDuck
