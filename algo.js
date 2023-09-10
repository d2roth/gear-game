// Learning from: https://adrianmejia.com/data-structures-for-beginners-graphs-time-complexity-tutorial/
// Circle detection from https://stackoverflow.com/q/19113189
class Queue {
  constructor() {
    this.input = [];
    this.output = [];
  }

  add(element){
    this.input.push(element);
  }

  remove() {
    if(!this.output.length){
      while(this.input.length){
        this.output.push(this.input.pop());
      }
    }
    return this.output.pop();
  }

  isEmpty() {
    return this.input.length === 0;
  }
}

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


// TODO: move stuff from class Positions into here and get rid of vertex.data
class Node {
  #team = null;

  constructor(value) {
    this.value = value;
    this.adjacents = []; // Adjacency list
  }

  set team(team){
    this.#team = team;
  }

  get team(){
    return this.#team;
  }

  addAdjacent(node){
    this.adjacents.push(node);
  }

  removeAdjacency(node){
    const index = this.adjacents.indexOf(node);
    if( index > -1 ){
      this.adjacents.splice(index, 1);
      return node;
    }
  }

  getAdjacents(){
    return this.adjacents;
  }

  isAdjacent(node) {
    return this.adjacents.indexOf(node) > -1;
  }
}

class Graph {
  constructor(edgeDirection = Graph.DIRECTED){
    this.nodes = new Map();
    this.edgeDirection = edgeDirection;
  }

  addEdge(source, destination) {
    const sourceNode = this.addVertex(source);
    const destinationNode = this.addVertex(destination);

    sourceNode.addAdjacent(destinationNode);

    if( this.edgeDirection === Graph.UNDIRECTED ){
      destinationNode.addAdjacent(sourceNode);
    }

    return [sourceNode, destinationNode];
  }

  addVertex(value) {
    if( this.getVertex(value) ){
      return this.getVertex(value);
    } else {
      const vertex = new Node(value);
      this.nodes.set(value,vertex);
      return vertex;
    }
  }

  getVertex(value){
    return this.nodes.get(value);
  }

  removeVertex(value){
    const current = this.nodes.get(value);
    if( current ){
      for( const node of this.nodes.values() ) {
        node.removeAdjacent(current);
      }
    }

    return this.nodes.delete(value);
  }

  removeEdge(source, destination){
    const sourceNode = this.nodes.get(source);
    const destinationNode = this.nodes.get(destination);

    if( sourceNode && destinationNode ){
      sourceNode.removeAdjacent(destinationNode);

      if(this.edgeDirection === Graph.UNDIRECTED ){
        destinationNode.removeAdjacent(sourceNode);
      }
    }

    return [sourceNode, destinationNode];
  }

  *bfs(first){
    const visited = new Map();
    const visitList = new Queue();

    visitList.add(first);

    while( !visitList.isEmpty() ){
      const node = visitList.remove();
      if( node && !visited.has(node) ){
        yield node;
        visited.set(node);
        node.getAdjacents().forEach( adj => visitList.add(adj) );
      }
    }
  }

  *dfs(first){
    const visited = new Map();
    const visitList = new Stack();

    visitList.add(first);

    while( !visitList.isEmpty() ){
      const node = visitList.remove();
      if( node && !visited.has(node) ){
        yield node;
        visited.set(node);
        node.getAdjacents().forEach(adj => visitList.add(adj));
      }
    }
  }
}

class CycleTest {

  constructor( graph, start ){
    this.graph = graph;
    this.marked = new Map();
    this.onStack = new Map();
    this.hasCycle = false;
    this.loops = 0;

    if( graph.edgeDirection === Graph.UNDIRECTED ){
      this.findUndirectedCycle( start, start );
    } else {
      this.findDirectedCycle( start );
    }
  }

  findUndirectedCycle( start, u ){
    this.marked.set(start, true);
    
    const length = start.adjacents.length;
    for( let i = 0; i< length; i++ ){
      this.loops++;
      const wing = start.adjacents[i];
      if( !this.marked.has(wing) ){
        this.marked.set(wing, true);
        this.findUndirectedCycle( wing, start );
      } else if (wing != start ){
        this.hasCycle = true;
        this.cycle = [wing, u];
        // const i = this.marked.entries();
        this.loopFound = [];
        this.marked.forEach((key,value) => {
          this.loopFound.push(value);
        })
        return;
      }
    };
  }

  findDirectedCycle( start ){
    this.marked.set(start, true);
    this.onStack.set(start, true);

    let length = start.adjacents.length;
    for( let i = 0; i< length; i++ ){
      this.loops++;
      const wing = start.adjacents[i];
      if( !this.marked.has(wing) ){
        this.findDirectedCycle( wing );
      } else if( this.onStack.has(wing) ) {
        this.hasCycle = true;
        this.cycle = [wing, start];
        return;
      }
    }

    this.onStack.delete(start);
  }
}

Graph.UNDIRECTED = Symbol('undirected graph'); // two-ways edges
Graph.DIRECTED = Symbol('directed graph'); // one-way edges

// function output(value){
//   const output = document.querySelector('#output');
//   output.value += JSON.stringify(value) + "\n";
// }

// const graph = new Graph(Graph.UNDIRECTED);

// const [first] = graph.addEdge(1,2);
//                 graph.addEdge(2,4);
//                 graph.addEdge(4,5);
//                 graph.addEdge(5,6);
//                 graph.addEdge(6,3);
//                 // graph.addEdge(1,3);
//                 graph.addEdge(3,1);

// test = new CycleTest(graph.edgeDirection, first);
// console.log( graph.edgeDirection, graph.nodes, test.hasCycle, test.loops );

// One graph needs to store the pieces played
// A second graph? needs to store the board

class Position {
  constructor(place){
    this.place = place;
  }

  get isEmpty() {
    return !this.team;
  }

  set team(team){
    this._team = team;
  }

  get team(){
    return this._team;
  }
}

class Game {
  state = "not_started";
  current_turn = 0;

  constructor(size){
    this.size = size;
    this.positions = new Graph(Graph.UNDIRECTED);
    // this.board = new Graph();

    this.buildBoard();
  }

  isRunning(){
    return this.state == "in_progress";
  }

  startGame(){
    this.state = "in_progress";
  }

  place( position, team ) {
    const vertex = this.positions.addVertex(position);

    if( vertex.data.isEmpty ){
      vertex.data.team = team;
      // this.positions.nodes.set( position );
    } else {
      throw new Error(`${position} is already populated by ${p.team}`)
    }
  }

  buildBoard(){
    // The board is a triangle
    // 1 touches 2, 3
    // 2 touches 1, 3, 4, 5
    // 3 touches 1, 3, 5, 6

    // left-side = 1/2 (2 - n + n^2)
    // Right side = 1/2 n (1 + n)

    function leftSide(row){
      return 1/2*row*(row-1)+1;
    }
    function rightSide(row){
      return 1/2*row*(1+row);
    }

    let i = 1;
    for( let row = 1; row <= this.size; row++ ){
      for( let col = 1; col <= row; col++){
        const vertex = this.positions.addVertex(i);
        vertex.data = new Position(i);

        // Up left
        if( col > 1 && row > 1 ){
          this.positions.addEdge(i, i-row);
        }

        // Up right
        if( col < row ){
          this.positions.addEdge(i, i-row+1);
        }

        // Left
        if( col > 1 ){
          this.positions.addEdge(i, i-1);
        }

        i++;
      }
    }
  }

  hasCycle(){
    const length = this.positions.nodes.size;

    console.log( this.positions.nodes );

    for( let i=1;i<=length;i++){
      const node = this.positions.getVertex(i);

      // TODO: Should only deal with positions that actually have a piece
      const cycleCheck = new CycleTest(this.positions., node);
      if( cycleCheck.hasCycle ){
        console.log( i, cycleCheck.loopFound );
        return true;
      }
    }

    return false;
  }
}


module.exports = Game