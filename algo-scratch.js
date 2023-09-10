// const play = new Map;

// class Graph {
//   verticies = new Map();
//   edges = new Map();

//   addVertice = (v) => {
//     this.verticies.set(v, new Set());
//   }

//   addEdge = (a, b) => {
//     if( !this.edges.has(a) ){
//       this.edges.set(a, new Set() );
//     }

//     let edge = this.edges.get(a);
//     edge.add(b)
//     this.edges.set(a,edge);
//   }
// }

// let g = new Graph();
// g.addVertice(1)
// g.addVertice(2)
// g.addVertice(3)

// g.addEdge(1,2);
// g.addEdge(2,3);
// g.addEdge(3,1);

class Game {
  state = 'not_started'; // not_started, in_progress, ended
  current_turn = 0;
  current_player = 0;
  players = 2;
  size = 5;

  graph = new Graph(Graph.UNDIRECTED);
  
  setState = (state) =>{
    this.state = state;
  }
  advanceTurn = () => {
    this.current_turn++;
  }
  advancePlayer = () => {
    this.current_player = ((this.current_player + 1) % this.players);
  }
  endTurn = () => {
    this.advanceTurn();
    this.advancePlayer();
  }
  start = () => {
    this.setState('in_progress');
  }
  board = [];
  
  // Draw a peg for a specific team
  drawPeg = (x,y,team) => {
    const size= 25;
    const peg = `<div class="peg team_${team}" style="left: ${x*size}px; top: ${y*size}px">${x}x${y}</div>`;
    const board = document.querySelector("#board");
    board.innerHTML = board.innerHTML + peg;
  }

  // Draw the board with all of our pieces on it
  drawBoard = () => {
    const board = document.querySelector("#board");
    board.innerHTML = "";

    this.board.forEach((xi, x) => {
      xi.forEach((team, y) => {
        console.log( xi,x,y,team);
        this.drawPeg(x,y,team);
      })
    });
  }

  // Make a move for the current player and end their turn
  play = (x, y) => {
    if( !this.board[x] ){
      this.board[x] = [];
    }
    this.board[x][y] = this.current_player;
    this.endTurn();
    this.drawBoard();
  }
};

// Game.start();
const instance = new Game;
// instance.drawBoard();
// // make our moves
instance.play(1);
instance.play(2);
instance.play(3);