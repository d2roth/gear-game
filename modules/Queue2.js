
class Queue2 {
  constructor() {
    this.input = new LinkedList();
  }

  add(element){
    this.input.addFirst(element);
  }

  remove() {
    return this.input.removeLast();
  }

  get size() {
    return this.input.size;
  }
}