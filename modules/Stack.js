const LinkedList = require('./LinkedList');

class Stack {
  constructor() {
    this.items = new LinkedList();
  }

  add(item) {
    this.items.addLast(item);
    return this;
  }

  remove() {
    return this.items.removeLast();
  }

  get size() {
    return this.items.size;
  }

  isEmpty() {
    return this.size === 0;
  }
}

module.exports = Stack