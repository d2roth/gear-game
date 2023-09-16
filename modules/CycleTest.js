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
    if( !start.isOccupied ){
      return;
    }
    this.marked.set(start, true);
    
    const length = start.adjacents.length;
    for( let i = 0; i< length; i++ ){
      this.loops++;
      const wing = start.adjacents[i];
      if( !this.marked.has(wing) ){
        this.findUndirectedCycle( wing, start );
      } else if (wing != u ){
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
    if( !start.isOccupied ){
      return;
    }
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

module.exports = CycleTest;