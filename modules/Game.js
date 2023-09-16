const Graph = require("./Graph");
const CycleTest = require("./CycleTest");

class Game {
  state = "not_started";
  current_turn = 0;

  constructor(size){
    this.size = size;
    this.pegs = new Graph(Graph.UNDIRECTED);

    this.buildBoard();
    const self = this;

    // Only build the board if we are in a browser
    if( typeof document !== 'undefined' ){
      this.drawBoard();

      const board = document.querySelector('#board');

      board.addEventListener('click', function(event){
        console.log( event.target, event.target.dataset.index );
        self.place(Number(event.target.dataset.index), 'green');
        self.drawBoard();
      })
    }
  }

  isRunning(){
    return this.state == "in_progress";
  }

  startGame(){
    this.state = "in_progress";
  }

  place( i, team ) {
    const vertex = this.pegs.getVertex(i);
    if( !vertex ){
      throw new Error( `Position ${i} does not exist` );
      return;
    }

    // if( !this.isRunning() ) {
    //   throw new Error( `You can't play. The game is not running.` );
    //   return false;
    // }

    if( !vertex.isOccupied ){
      vertex.team = team;
      // this.pegs.nodes.set( i );
    } else {
      throw new Error(`${i} is already populated by ${vertex.team}`)
    }
  }

  buildBoard(){
    // The board is a triangle
    // 1 touches 2, 3
    // 2 touches 1, 3, 4, 5
    // 3 touches 1, 3, 5, 6

    // left-side = 1/2 (2 - n + n^2)
    // Right side = 1/2 n (1 + n)

    // leftSide = (row) => {return 1/2*row*(row-1)+1;}
    // rightSide = (row) => {return 1/2*row*(1+row);}

    let i = 1;
    for( let row = 1; row <= this.size; row++ ){
      for( let col = 1; col <= row; col++){
        const vertex = this.pegs.addVertex(i);

        // Up left
        if( col > 1 && row > 1 ){
          this.pegs.addEdge(i, i-row);
        }

        // Up right
        if( col < row ){
          this.pegs.addEdge(i, i-row+1);
        }

        // Left
        if( col > 1 ){
          this.pegs.addEdge(i, i-1);
        }

        i++;
      }
    }
  }

  drawBoard (){
    const board = document.querySelector('#board');
    board.innerHTML = "";

    const length = this.pegs.nodes.size;

    for( let i=1;i<=length;i++){
      let node = this.pegs.nodes.get(i);

      // this.pegs.nodes;
      let peg = document.createElement('peg');
      peg.id = `peg-${i}`;
      peg.innerText = i;
      peg.dataset.index = i;
      if( node ){
        peg.style.background = node.team;
      }
      board.appendChild(peg);
    }
  }

  hasCycle(){
    const length = this.pegs.nodes.size;

    // console.log( this.pegs.nodes );

    for( let i=1;i<=length;i++){
      const node = this.pegs.getVertex(i);
      // TODO: Should only deal with pegs that actually have a piece
      // TODO: change to Graph checking....
      const isCycle = this.pegs.isCycle(node);
      // console.log( node, isCycle, Array.from( this.pegs.marked.entries() ) )
      if( isCycle ){
        return isCycle;
      } else {
        // console.log ({node: node, pegs: this.pegs});
      }
      // const cycleCheck = new CycleTest(this.pegs, node);
      // if( cycleCheck.hasCycle ){
      //   console.log( i, cycleCheck.loopFound );
      //   return true;
      // }
    }

    return false;
  }
}


module.exports = Game;