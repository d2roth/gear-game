const Node = require('./Node');

class LinkedList {
  constructor() {
    this.first = null; // head/root element
    this.last = null; // last element of the list
    this.size = 0; // total elements in the list
  }

  add(value, index = 0){
    if(index === 0){
      return this.addFirst(value);
    }

    for( let current = this.first, i = 0; i <= this.size; i++, current = (current && current.next) ){
      // DR: If we hit our index..
      if( i === index ){
        if( i === this.size ) { // If it is the last item 
          return this.addLast(value);
        }

        const newNode = new Node(value);
        newNode.previous = current.previous;
        newNode.next = current;

        // The previous element's next node is us
        current.previous.next = newNode;
        // If we have another node after us its previous one is us
        if(current.next) { current.next.previous = newNode; }
        this.size++;
        return newNode;
      }
    }
  }

  addFirst(value){
    const node = new Node(value);

    // DR: What is next/first???
    node.next = this.first;

    // DR: If there was a first node that will be the previous node...
    if( this.first ){
      this.first.previous = node;
    } else {
      // DR: If there is no first element then this node is the last one...
      this.last = node;
    }

    this.first = node; // update head
    this.size++;

    return node;
  }

  removeFirst() {
    const first = this.first;

    if(first){
      this.first = first.next;
      if( this.first ){
        this.first.previous = null;
      }

      this.size--;

      return first.value;
    } else {
      this.last = null;
    }
  }

  addLast(value){
    const node = new Node(value);

    if( this.first ){
      let currentNode = this.first;
      node.previous = this.last;
      this.last.next = node;
      this.last = node;
    } else {
      this.first = node;
      this.last = node;
    }

    this.size++;

    return node;
  }

  removeLast() {
    let current = this.first; // DR: not sure why using this.first and not this.last...
    let target;

    if(current && current.next){
      current = this.last.previous; // grab the second lsat one
      this.last = current; // move it to the end
      target = current.next;
      current.next = null;
    } else {
      this.first = null;
      this.last = null;
      target = current;
    }

    if(target) {
      this.size--;
      return target.value;
    }
  }
}

module.exports = LinkedList;