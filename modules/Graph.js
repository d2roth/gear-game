const Node = require("./Node");

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
  
  isCycle( start ){
    // For Cycle Testing
    this.marked = new Map();
    this.onStack = new Map();
    this.loops = 0;

    if( this.edgeDirection === Graph.UNDIRECTED ){
      return this.findUndirectedCycle( start, start );
    } else {
      return this.findUndirectedCycle( start );
    }
  }

  findUndirectedCycle( start, u, hasCycle ){
    if( !start.isOccupied ){
      return hasCycle;
    }
    this.marked.set(start, true);
    
    const length = start.adjacents.length;
    for( let i = 0; i< length; i++ ){
      this.loops++;
      const wing = start.adjacents[i];
      if( !this.marked.has(wing) ){
        hasCycle = this.findUndirectedCycle( wing, start, hasCycle );
      } else if (wing != u ){
        // this.hasCycle = true;
        this.cycle = [wing, u];
        // const i = this.marked.entries();
        this.loopFound = [];
        this.marked.forEach((key,value) => {
          this.loopFound.push(value);
        })
        return true;
      }
    }

    return hasCycle;
  }

  findDirectedCycle( start, hasCycle ){
    if( !start.isOccupied ){
      return hasCycle;
    }
    this.marked.set(start, true);
    this.onStack.set(start, true);

    let length = start.adjacents.length;
    for( let i = 0; i< length; i++ ){
      this.loops++;
      const wing = start.adjacents[i];
      if( !this.marked.has(wing) ){
        return this.findDirectedCycle( wing, hasCycle || false );
      } else if( this.onStack.has(wing) ) {
        // this.hasCycle = true;
        this.cycle = [wing, start];
        return true;
      }
    }

    this.onStack.delete(start);
    return hasCycle;
  }
}

Graph.UNDIRECTED = Symbol('undirected graph'); // two-ways edges
Graph.DIRECTED = Symbol('directed graph'); // one-way edges

module.exports = Graph