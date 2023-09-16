// const Queue = require( './Queue' );
// const Stack = require( './Stack' );

class Node {
  #team = null;

  constructor(value) {
    this.value = value;
    this.adjacents = []; // Adjacency list
    this.direction = Node.DIRECTION_NONE;
  }

  get isOccupied() {
    return !!this.team;
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

  isStuck(){
    return this.direction === Node.DIRECTION_STUCK;
  }

  *bfs(start){
    const visited = new Map();
    const visitList = [];

    visitList.push(start);

    while( visitList.length ){
      const node = visitList.shift();
      if( node && !visited.has(node) ){
        yield node;
        visited.set(node);
        node.getAdjacents().forEach( adj => visitList.push(adj) );
      }
    }
  }

  *dfs(start){
    const visited = new Map();
    // const visitList = new Stack();
    let visitList = [];

    visitList.push(start);

    while( visitList.length ){
      const node = visitList.pop();
      if( node && !visited.has(node) ){
        yield node;
        visited.set(node);
        node.getAdjacents().forEach(adj => visitList.push(adj));
      }
    }
  }

  // Spin everything touched this node.
  // Start by spinning this node clockwise
  // Find any adjacent nodes and spin them counter-clockwise
  // Now we are working on an adjacent element but we don't want to hit this one again.
  spin( newDirection, visited ) {
    visited = visited || new Map;

    if( !visited.has( this.value ) ){
      // Start the visited with us...
      visited.set( this );
    }

    // If we are not given a directoin turn clockwise
    if( typeof newDirection == "undefined" && this.direction == Node.DIRECTION_NONE ){
      this.direction = Node.DIRECTION_CLOCKWISE;
    } else if( this.direction != Node.DIRECTION_NONE && this.direction != newDirection ){
      // We are stuck if we are turning and asked to turn differently
      this.direction = Node.DIRECTION_STUCK;
    } else {
      this.direction = newDirection;
    }
    // console.log( this.value, this.direction, newDirection );

    let lastDirection = this.direction;
    for( const touched of this.dfs(this) ){
      if( touched == this ){
        continue;
      }

      let nextDirection = Node.DIRECTION_DEBUG;
      // switch ( lastDirection ){
      //   case Node.DIRECTION_CLOCKWISE:
      //     nextDirection = Node.DIRECTION_COUNTER_CLOCKWISE;
      //     break;
      //   case Node.DIRECTION_COUNTER_CLOCKWISE:
      //     nextDirection = Node.DIRECTION_CLOCKWISE;
      //     break;
      //   case touched.direction:
      //   default:
      //     nextDirection = Node.DIRECTION_STUCK;
      // }

      // let nextDirection = lastDirection == Node.DIRECTION_CLOCKWISE ? Node.DIRECTION_COUNTER_CLOCKWISE : Node.DIRECTION_CLOCKWISE;
      if( !visited.has(touched) ){
        visited.set(touched);
        touched.spin(nextDirection, visited);
      }

      lastDirection = nextDirection;
    }
  }
}

Node.DIRECTION_CLOCKWISE = Symbol('clockwise direction');
Node.DIRECTION_COUNTER_CLOCKWISE = Symbol('counter-clockwise direction');
Node.DIRECTION_STUCK = Symbol('stuck direction');
Node.DIRECTION_NONE = Symbol('no direction');
Node.DIRECTION_DEBUG = Symbol('debug');

module.exports = Node;

