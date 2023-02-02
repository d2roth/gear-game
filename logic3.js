const config = {
  size:     50,                     // how big to make the cog
  notches:  8,                      // num. of notches
  taperO:   60,                     // outer taper 50%
  taperI:   35,                     // inner taper 35%
};

config.canvas   = document.getElementById('gameBoard');
config.ctx      = config.canvas.getContext('2d');
config.radiusO  = config.size * 1;               // outer radius
config.radiusI  = config.size * .65;             // inner radius
config.teams = [
  {
    'fillStyle': 'red',
    'name': 'Red',
    'cogs': 15,
  },
  {
    'fillStyle': 'blue',
    'name': 'Blue',
    'cogs': 15,
  },
];

function standardize_color(str){ var ctx = document.createElement('canvas').getContext('2d'); ctx.fillStyle = str; return ctx.fillStyle; }


let Peg = function(cfg){
  this.x = cfg.x;
  this.y = cfg.y;
  this.top = cfg.top;
  this.left = cfg.left;
  this.width = cfg.size;
  this.height = cfg.size;
  this.colliding = false;
  this.stuck = false;
  this.clockwise = true;
  this.index = Game.pegs.length;
  this.edges = [];
  this.verticies = [];
  this.occupied = false;
  this.occupiedSiblings = function () {return this.edges.filter(p => { return p.occupied })};
  this.centerX = function(){return this.left + (this.width/2);};
  this.centerY = function(){return this.top + (this.height/2);};
  this.draw = function(){
    this.calculateVerticies();

    let color = this.color || config.teams[this.team].fillStyle;
    let alpha = .5;
    let alphaHex = "";
    if( this.occupied == 'maybe' ){
      let x = alpha * 255; 
      let y = Math.floor(x);  // int, e.g. y = 76
      let s = y.toString(16);
      alphaHex = y<16?'0'+s:s;
    }
    config.ctx.fillStyle = standardize_color(color) + alphaHex;//'#fff';
    config.ctx.beginPath();

    // move to starting point
    // config.ctx.moveTo(cx, cy);
    
    // Start Marker to add a line to see how the items are rotating
    config.ctx.lineWidth = 10;
    config.ctx.strokeStyle = 'white';
    let startPoint = this.verticies.shift();
    config.ctx.moveTo(startPoint.x, startPoint.y);
    secondPoint = this.verticies.shift();
    config.ctx.lineTo(secondPoint.x, secondPoint.y);
    config.ctx.stroke();
    // End marker

    let cx = this.centerX();
    let cy = this.centerY();
    let lastPoint = {x:cx, y:cy};
    this.verticies.forEach( function(point) {
      // config.ctx.lineTo( aInner[0], aInner[1] );
      // config.ctx.lineTo( aOuter[0], aOuter[1] );
      if( point.toggle ){
        // config.ctx.lineTo(lastPoint.x, lastPoint.y);
        config.ctx.lineTo(point.x, point.y);
      } else {
        config.ctx.lineTo(point.x, point.y);
        config.ctx.lineTo(lastPoint.x, lastPoint.y);
      }
      lastPoint=point;
    } );

    config.ctx.fill();
    // close the final line
    config.ctx.closePath();

    radiusH = config.radiusO / 4;

    // "erase" mode (term simplified)
    config.ctx.globalCompositeOperation = 'destination-out';

    // create circle (full arc)
    config.ctx.beginPath();
    config.ctx.moveTo(cx + radiusH, cy);
    config.ctx.arc(cx, cy, radiusH, 0, config.pi2);
    config.ctx.closePath();

    // creates the hole
    config.ctx.fill();

    // reset comp. mode
    config.ctx.globalCompositeOperation = 'source-over';

    // without filling/stroking, continue with:
    // Punch hole
    config.ctx.moveTo(cx + radiusH, cy);
    config.ctx.arc(cx, cy, radiusH, 0, config.pi2);

    // now fill using even-odd rule
    config.ctx.fill("evenodd");

    // config.ctx.translate(-cx, -cy);
    // config.ctx.restore();
  }

  this.isColliding = function() {
    colliding = false;

    this.calculateVerticies();

    this.occupiedSiblings().forEach((sibling) => {
      if( !colliding && this.verticies.length && sibling.verticies.length ) {
        // console.table([
        //   { index: this.index, rotation: this.rotation, clockwise: this.clockwise },
        //   { index: sibling.index, rotation: sibling.rotation, clockwise: sibling.clockwise }
        // ]);
        sibling.calculateVerticies();
        colliding = polygonsCollide(this.verticies, sibling.verticies);
        if( colliding ){
          this.collidingWith = {
            self: {
              rotation: this.rotation,
              clockwise: this.clockwise,
            },
            sibling: {
              rotation: sibling.rotation,
              clockwise: sibling.clockwise
            }
          }
        }
      }
    });

    // console.log( `After testing the conclusion is ${this.index} is ${colliding ? "Colliding" : "not Colliding"}` );
    return colliding;
  }

  this.rotate = function(){
    if( this.stuck ){
      return;
    }
    // console.log( `rotating ${this.index}`)
    let limit = 32;
    let colliding = this.isColliding();
    let startRotation = this.rotation;
    let startClockwise = this.clockwise;

    if( !colliding ){
      this.rotation++;
      return;
    }

    if( this.occupiedSiblings().some(o => o.clockwise == this.clockwise) ){
      this.clockwise = !this.clockwise;
    }

    console.group(`${this.index} is colliding. Trying to fix it`);
    // console.log( `${this.index} is colliding at ${this.rotation} turning ${this.clockwise ? "clockwise": "counter-clockwise"}` )
    console.log( `It is turning ${this.clockwise ? "clockwise": "counter-clockwise"}` )

    // test up to limit in both directions to see if we can get unstuck
    let i = 0;
    do{
      // add on this rotation
      this.rotation = startRotation + i;

      // try first this direction
      colliding = this.isColliding();
      console.table(this.collidingWith)
      console.log( `After rotating ${this.clockwise ? "clockwise" : "counter-clockwise"} to ${this.rotation} we are ${colliding ? "colliding" : "not colliding"}`);
    } while ( i++ < limit && colliding )

    if( colliding ){
      let j = 0;
      this.clockwise = !this.clockwise;
      do{
        // add on this rotation
        this.rotation = startRotation + j;

        // try first this direction
        colliding = this.isColliding();
        console.table(this.collidingWith)
        console.log( `After rotating ${this.clockwise ? "clockwise" : "counter-clockwise"} to ${this.rotation} we are ${colliding ? "colliding" : "not colliding"}`);
      } while ( j++ < limit && colliding )
    }

    this.stuck = colliding;
    console.log( `It is ending ${this.stuck ? "stuck":"not stuck"}` );
    console.groupEnd();
    // this.clockwise = startClockwise;
    // console.log( `${this.index} is turning ${this.clockwise ? "clockwise" : "counter-clockwise"}` )
  }

  this.calculateVerticies = function(){
    // Handle rotating the icons each draw
    if( !this.rotation || this.rotation > 360 ){
      this.rotation = 0;
    }

    let offset = 0;
    let rotation = this.rotation;// * 36;
    if( !this.clockwise )
      rotation = rotation * -1;

    let x = this.centerX();
    let y = this.centerY();
    let occupied = this.occupied;

    // pre-calculate values for loop
    let cx  = x,
    cy      = y, 
    pi2     = 2 * Math.PI,            // cache 2xPI (360deg)
    angle   = pi2 / (config.notches * 2),    // angle between notches
    taperAI = angle * config.taperI * 0.005, // inner taper offset (100% = half notch)
    taperAO = angle * config.taperO * 0.005, // outer taper offset
    a       = angle,                  // iterator (angle)
    toggle  = false;                  // notch radius level (i/o)

    this.verticies = [];
    this.verticies.push({x: cx, y: cy, toggle: false});

    // Rotate a vertice around a point angle degrees
    function rotate(cx, cy, x, y, angle){
      var radians = (Math.PI / 180) * angle,
          cos = Math.cos(radians),
          sin = Math.sin(radians),
          nx = (cos * (x-cx)) + (sin * (y-cy)) + cx,
          ny = (cos * (y-cy)) - (sin * (x-cx)) + cy;
      
      return [nx,ny];//value * deg;
    }

    for (a=0; a <= pi2+2; a += angle) {
      let aOuter = aInner = [];
      // draw inner to outer line
      if (toggle) {
          aInner = rotate(cx, cy, cx + ( config.radiusI * (Math.cos(a - taperAI) ) ),
                            cy + ( config.radiusI * (Math.sin(a - taperAI) ) ),
                            rotation + offset);
          aOuter = rotate(cx, cy, cx + ( config.radiusO * (Math.cos(a + taperAO) ) ),
                            cy + ( config.radiusO * (Math.sin(a + taperAO) ) ),
                            rotation + offset)
      }
      // draw outer to inner line
      else {
          aOuter = rotate(cx, cy, cx + ( config.radiusO * (Math.cos(a - taperAO) ) ),
                            cy + ( config.radiusO * (Math.sin(a - taperAO) ) ),
                            rotation + offset);
          aInner = rotate(cx, cy, cx + ( config.radiusI * (Math.cos(a + taperAI) ) ),
                            cy + ( config.radiusI * (Math.sin(a + taperAI) ) ),
                            rotation + offset);
      }

      // Add both points to the peg's verticies.
      this.verticies.push({x: aInner[0], y: aInner[1], toggle: toggle});
      this.verticies.push({x: aOuter[0], y: aOuter[1], toggle: toggle});

      // switch level
      toggle = !toggle;
    }
  }
}

let Game = {
  pegs:   [],    // Hold information about the pegs on the board
  moving: false, // Whether we are currently moving or not
  startingTeam: function(){return Math.floor(Math.random() * config.teams.length);},
  team: function(){return this.startingTeam()},
  advanceTeam: function(){return this.team < config.teams.length-1 ? this.team+1:0;}
};

Game.init = function(){
  this.drawGrid(25);
  this.drawCanvas(true);
  config.canvas.addEventListener('click', this.listenForPegClicks.bind(this), false);

  // Draw the canvas and where everything is regularly
  setInterval(() => this.drawCanvas(), 10);
}

Game.drawGrid = function( step ){
  // draw a line every *step* pixels
  step = step || 25

  // our end points
  const width = config.canvas.width
  const height = config.canvas.height

  // set our styles
  config.ctx.save()
  config.ctx.strokeStyle = 'gray' // line colors
  config.ctx.fillStyle = 'black' // text color
  config.ctx.font = '14px Monospace'
  config.ctx.lineWidth = 0.35;

  const everyX = Math.floor( width / step );
  const everyY = Math.floor( height / step );

  // draw vertical from X to Height
  for (let x = 0; x < width; x += step) {
    // draw vertical line
    config.ctx.beginPath()
    config.ctx.moveTo(x, 0)
    config.ctx.lineTo(x, height)
    config.ctx.stroke()

    if( x % everyX === 0 ){
      // draw text
      config.ctx.fillText(x, x, 12)
    }
  }

  // draw horizontal from Y to Width
  for (let y = 0; y < height; y += step) {
    // draw horizontal line
    config.ctx.beginPath()
    config.ctx.moveTo(0, y)
    config.ctx.lineTo(width, y)
    config.ctx.stroke()

    if( y % everyY === 0 ){
      // draw text
      config.ctx.fillText(y, 0, y)
    }
  }

  // restore the styles from before this function was called
  config.ctx.restore()
}

Game.drawPeg = function( left, top, init ){
  const size = 75;

  // filled square X: 125, Y: 35, width/height 50
  config.ctx.beginPath()

  config.ctx.strokeStyle = 'red'
  config.ctx.fillStyle = 'black';
  config.ctx.lineWidth = 10;
  // config.ctx.rect(x, y, size, size);

  config.ctx.arc(left + (size /2), top + (size /2), 15, 0, 2 * Math.PI, false) // full circle

  // config.ctx.rect(200, 35, 50, 50)
  config.ctx.fill()
  // config.ctx.stroke()
  if( init ){
    this.pegs.push({
      left: left,
      top: top,
      width: size,
      height: size,
      centerX: left + (size/2),
      centerY: top + (size/2),
    });
  }
}

Game.drawPegs = function( maxWidth, init ){
  maxWidth = maxWidth || 15;
  // const size = 75;
  const size = 80;

  // our end points
  const width = config.canvas.width
  const height = config.canvas.height

  config.ctx.save();
  let centerX = width / 2;
  let centerY = height / 2;
  let offset = size / 2;

  let peg = 0;

  for( y = 0; y <= maxWidth; y++){
    for( x = 0; x <= y; x++){
      // const top = (y*size) + offset; // make sure we don't get too close to the top
      // const left = ( x - (y / 2) ) * size + (center-offset); // position this in the center of the canvas
      const top  = (( y - (y/2) ) * size) * 1.9 + offset; // make sure we don't get too close to the top
      const left = (( x - (y/2) ) * size) * 1.1 + (centerX-offset); // position this in the center of the canvas
      // drawPeg(left, top, init);
      // filled square X: 125, Y: 35, width/height 50
      config.ctx.beginPath()

      config.ctx.strokeStyle = 'red'
      config.ctx.fillStyle = 'black';
      config.ctx.lineWidth = 10;
      // config.ctx.rect(x, y, size, size);

      config.ctx.arc(left + (size /2), top + (size /2), 15, 0, 2 * Math.PI, false) // full circle

      // config.ctx.rect(200, 35, 50, 50)
      // config.ctx.fillStyle = y%2 ? "pink":"green";
      // config.ctx.rect(left, top, size, size);
      config.ctx.fill();

      config.ctx.fillStyle = 'orange';
      config.ctx.font = "30px Arial";
      config.ctx.textAlign = 'center';
      config.ctx.textBaseline = 'middle'; 
      config.ctx.fillText(peg, left + (size /2), top + (size /2));

      // config.ctx.stroke()
      if( init ){
        if( !this.pegs[y] )
          this.pegs[y] = [];
        if( !this.pegs[y][x] )
          this.pegs[y][x] = {};

        // let obj = {
        //   x: x,
        //   y: y,
        //   left: left,
        //   top: top,
        //   width: size,
        //   height: size,
        //   centerX: left + (size/2),
        //   centerY: top + (size/2),
        //   edges: [],
        //   verticies: [],
        //   index: pegs.length,
        //   occupied: false,
        //   clockwise: true,
        //   occupiedSiblings: function () {return this.edges.filter(p => { return p.occupied })},
        // };
        
        let obj = new Peg({
          x: x,
          y: y,
          top: top,
          left: left,
          size: size,
        });

        this.pegs[y][x] = obj;
        this.pegs.push(obj);

        // Up left
        if( this.pegs[y-1] && this.pegs[y-1][x-1] ){
          // Add to remote
          this.pegs[this.pegs[y-1][x-1].index].edges.push(obj);

          // Add locally
          obj.edges.push(this.pegs[y-1][x-1]);
        }

        // Up right
        if( this.pegs[y-1] && this.pegs[y-1][x] ){
          // Add to remote
          this.pegs[this.pegs[y-1][x].index].edges.push(obj);

          // Add locally
          obj.edges.push(this.pegs[y-1][x]);
        }

        // Left
        if( this.pegs[y] && this.pegs[y][x-1] ){
          // Add to remote
          this.pegs[this.pegs[y][x-1].index].edges.push(obj);

          // Add locally
          obj.edges.push(this.pegs[y][x-1]);
        }

        // previous row same column = up right
        // same row previous column
        // console.log( pegs );
      }
      peg++;
    }
  }
  config.ctx.restore();
}

Game.drawCanvas = function (init){
  config.ctx.clearRect(0, 0, config.canvas.width, config.canvas.height);

  this.drawGrid(50, init);

  // this.updateScore();
  // this.setTeamIndicator();

  this.pegs.filter(p => p.occupied).forEach(function(peg){
    let fillStyle = config.teams[peg.team].fillStyle || 'purple';
    peg.rotate();
    // drawCog(peg.centerX, peg.centerY, fillStyle, peg.occupied);
    peg.draw();
  });
  this.drawPegs(5, init);
}

Game.listenForPegClicks = function(e){
  const canvasLeft = config.canvas.offsetLeft + config.canvas.clientLeft;
  const canvasTop = config.canvas.offsetTop + config.canvas.clientTop;
  var x = event.pageX - canvasLeft,
      y = event.pageY - canvasTop;

  let newTeam = this.advanceTeam();

  // Collision detection between clicked offset and element.
  this.pegs.forEach((peg, index) => {
    // Collission detection for this space
    if (y > peg.top && y < peg.top + peg.height 
      && x > peg.left && x < peg.left + peg.width) {

      // if the peg is occupied then check if we can move it
      if( peg.occupied == true ){
        if( peg.fixed ){
          alert('You can\'t move that piece');
          return false;
        }

        if( peg.team != newTeam ){
          alert("There is already a piece there");
          return false;
        }

        // If we are already moving a peg
        if( this.moving ){
          this.moving.occupied = true;
        }

        this.moving = peg;
        peg.occupied = 'maybe';
      } else {
        // This peg is unoccupied so stop moving and place the piece
        this.moving = false;

        // Swap any partial pegs to unoccupied pegs again
        this.pegs.filter(p => p.occupied == 'maybe').forEach( function(peg){
          peg.team = undefined;
          peg.occupied = false;
        });

        this.team = newTeam;
        peg.team = newTeam;
        peg.occupied = true;
        // this.drawCanvas();
      }
    }
  });
}

Game.init();

/**
 * @source: https://sodocumentation.net/html5-canvas/topic/5017/collisions-and-intersections#are-2-polygons-colliding---both-concave-and-convex-polys-are-allowed-
 */
// polygon objects are an array of vertices forming the polygon
//     var polygon1=[{x:100,y:100},{x:150,y:150},{x:50,y:150},...];
// The polygons can be both concave and convex
// return true if the 2 polygons are colliding 

function polygonsCollide(p1,p2){
    // turn vertices into line points
    var lines1=verticesToLinePoints(p1);
    var lines2=verticesToLinePoints(p2);
    // test each poly1 side vs each poly2 side for intersections
    for(i=0; i<lines1.length; i++){
    for(j=0; j<lines2.length; j++){
        // test if sides intersect
        var p0=lines1[i][0];
        var p1=lines1[i][1];
        var p2=lines2[j][0];
        var p3=lines2[j][1];
        // found an intersection -- polys do collide
        if(lineSegmentsCollide(p0,p1,p2,p3)){return(true);}
    }}
    // none of the sides intersect
    return(false);
}
// helper: turn vertices into line points
function verticesToLinePoints(p){
    // make sure polys are self-closing
    if(!(p[0].x==p[p.length-1].x && p[0].y==p[p.length-1].y)){
        p.push({x:p[0].x,y:p[0].y});
    }
    var lines=[];
    for(var i=1;i<p.length;i++){
        var p1=p[i-1];
        var p2=p[i];
        lines.push([ 
            {x:p1.x, y:p1.y},
            {x:p2.x, y:p2.y}
        ]);
    }
    return(lines);
}
// helper: test line intersections
// point object: {x:, y:}
// p0 & p1 form one segment, p2 & p3 form the second segment
// Get interseting point of 2 line segments (if any)
// Attribution: http://paulbourke.net/geometry/pointlineplane/
function lineSegmentsCollide(p0,p1,p2,p3) {
    var unknownA = (p3.x-p2.x) * (p0.y-p2.y) - (p3.y-p2.y) * (p0.x-p2.x);
    var unknownB = (p1.x-p0.x) * (p0.y-p2.y) - (p1.y-p0.y) * (p0.x-p2.x);
    var denominator  = (p3.y-p2.y) * (p1.x-p0.x) - (p3.x-p2.x) * (p1.y-p0.y);        

    // Test if Coincident
    // If the denominator and numerator for the ua and ub are 0
    //    then the two lines are coincident.    
    if(unknownA==0 && unknownB==0 && denominator==0){return(null);}

    // Test if Parallel 
    // If the denominator for the equations for ua and ub is 0
    //     then the two lines are parallel. 
    if (denominator == 0) return null;

    // test if line segments are colliding
    unknownA /= denominator;
    unknownB /= denominator;
    var isIntersecting=(unknownA>=0 && unknownA<=1 && unknownB>=0 && unknownB<=1)

    return(isIntersecting);
}