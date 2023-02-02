// console.clear();
// stack = [];
// explored = [];
// peg = pegs[0];
// pegs.forEach(peg => {
//   if( ( explored[peg.index] && explored[peg.index].visited ) || peg.team === undefined )
//     return;
//   stack.push(peg);
  
//   function addCog(cog){
//     // Now add all of the edges and traverse them.
//     cog.edges
//       .filter( n => !(explored[n.index] && explored[n.index].visited ) && n.team !== undefined )
//       .forEach( n => {
//         explored[n.index] = explored[n.index] || { chains: [], visited: true }
//         explored[n.index].chains.push(n);
//         stack.push(n);
//         console.log( `Adding ${n.index} to ${cog.index}` )
//       });
//   }
//   while( stack.length > 0 ){
//     let t = stack.pop();
//     explored[t.index] = explored[t.index] || { chains: [], visited: true }
//     console.log( `Now exploring ${t.index}`);
//     addCog(t);
//   }
// });

// console.log( explored );

// // The graph
// var adjacencyList = new Map();

// // Add node
// function addNode(cog) {
//   adjacencyList.set(cog.index, []);
// }

// // Add edge, undirected
// function addEdge(origin, destination) {
//   adjacencyList.get(origin.index).push(destination.index);
//   adjacencyList.get(destination.index).push(origin.index);
// }

// // Create the Graph
// pegs.forEach(addNode);
// // Add the paths that are connected
// pegs.filter(p => p.team).forEach(peg => {
//   peg.edges.filter(p => p.team).forEach( cog => {
//     addEdge(peg, cog);
//   })
// })


// function dfs(start, visited = new Set()) {

//   console.log('Start: ' + start)
//   visited.add(start);
//   const destinations = adjacencyList.get(start);

//   for (const destination of destinations) {
//     if (destination === 1) { 
//       console.log(`DFS found Bangkok`)
//       return;
//     }
    
//     if (!visited.has(destination)) {
//       dfs(destination, visited);
//     }
//   }
// }


// dfs(1)

// index.js
// ;(function () {
  const canvas = document.getElementById('gameBoard')
  const ctx = canvas.getContext('2d');

  let cogs = []; 
  let pegs = []; // hold information about each space on the board
  let teams = [
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

  function startingTeam(){
    return Math.floor(Math.random() * teams.length);
  }

  let team = startingTeam();
  let moving = false;

  function advanceTeam(){
    return team < teams.length-1 ? team+1:0;
  }
  canvas.addEventListener('click', function(e) {
    const canvasLeft = canvas.offsetLeft + canvas.clientLeft;
    const canvasTop = canvas.offsetTop + canvas.clientTop;
    var x = event.pageX - canvasLeft,
        y = event.pageY - canvasTop;

    let newTeam = advanceTeam();

    // Collision detection between clicked offset and element.
    pegs.forEach(function(peg, index) {
      // Collission detection for this space
      if (y > peg.top && y < peg.top + peg.height 
        && x > peg.left && x < peg.left + peg.width) {

        // if( peg.team ){
        //   alert( 'This peg already has a team on it' );
        //   return;
        // }
        
        // console.log( peg, newTeam, peg.team, team, pegs.filter( p => p.occupied ) );

        // if already occupied by this team unset the space maybe
        if( peg.occupied == true ){
          if( peg.fixed ){
            alert('You can\'t move that piece');
            return false;
          }
          if( moving ){
            alert('You are already moving a piece');
            return false;
          }
          if( peg.team == newTeam ){
            console.log( 'This peg is already occupied so moving' );
            peg.occupied = 'maybe';
            drawCanvas();
            moving = true;
            return;
          } else {
            alert('That is not your piece!');
            return false;
          }
        } else {
          moving = false;
          // Swap any partial pegs to unoccupied pegs again
          pegs.filter(p => p.occupied == 'maybe').forEach( function(peg){
            peg.team = undefined;
            peg.occupied = false;
          });
          team = newTeam;
          peg.team = newTeam;
          peg.occupied = true;
          drawCanvas();
        }
      }
    });
  }, false);

  function standardize_color(str){ var ctx = document.createElement('canvas').getContext('2d'); ctx.fillStyle = str; return ctx.fillStyle; }

  function drawCanvas(init){
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid(50, init);

    updateScore();
    setTeamIndicator();

    pegs.filter(p => p.occupied).forEach(function(peg){
      let fillStyle = teams[peg.team].fillStyle || 'purple';
      // drawCog(peg.centerX, peg.centerY, fillStyle, peg.occupied);
      drawCog(peg, fillStyle);
    });
    drawPegs(5, init);
  }

  let draws = 0;
  function setTeamIndicator(){
    ctx.save();
    ctx.beginPath();
    let nextTeam = advanceTeam();
    ctx.fillStyle = teams[nextTeam].fillStyle;
    ctx.fillRect(0, 0, 50, 50);

    ctx.font = "30px Arial";
    ctx.fillStyle = 'black' // text color
    ctx.textAlign = 'right';
    ctx.fillText(draws++, canvas.width - 15, canvas.height - 15);

    ctx.restore();
  }

  function updateScore(){
    ctx.save();

    // let pegs = pegs.filter(p => p.occupied ); 

    ctx.font = "30px Arial";
    teams.forEach(function(team, i){
      ctx.beginPath();
      ctx.fillStyle = team.fillStyle;
      let pegsOnBoard = pegs.filter(c => c.team === i).length;
      let cogsLeft = team.cogs - pegsOnBoard;
      // console.log( team.cogs, pegsOnBoard, team );
      ctx.fillText(`${team.name} has ${cogsLeft} left`, 100, 100+(i*50)); 
    })

    ctx.restore();
  }

  function drawCog(peg, color){
    console.group( "drawing cog: " + peg.index)
    // Handle rotating the icons each draw
    if( !peg.rotation || peg.rotation > 360 ){
      peg.rotation = 0;
    }

    peg.rotation++;

    let rotation = peg.rotation;// * 36;
    // if( !peg.clockwise )
    //   rotation = rotation * -1;

    let x = peg.centerX;
    let y = peg.centerY;
    let occupied = peg.occupied;

    // Draw the cogs
    var cx      = x,                  // center x
    cy      = y,                      // center y
    size    = 50,                     // how big to make the cog
    notches = 8,                      // num. of notches
    radiusO = size * 1,               // outer radius
    radiusI = size * .65,             // inner radius
    taperO  = 60,                     // outer taper 50%
    taperI  = 35,                     // inner taper 35%

    // pre-calculate values for loop

    pi2     = 2 * Math.PI,            // cache 2xPI (360deg)
    angle   = pi2 / (notches * 2),    // angle between notches
    taperAI = angle * taperI * 0.005, // inner taper offset (100% = half notch)
    taperAO = angle * taperO * 0.005, // outer taper offset
    a       = angle,                  // iterator (angle)
    toggle  = false;                  // notch radius level (i/o)

    // ctx.save();
    // ctx.translate(cx, cy);
    // ctx.rotate( deg * Math.PI / 180 );

    // Whether this peg is colliding with another one
    let colliding = false,
        stuck = false; // whether the peg is stuck in an infinite loop

    function rotate(cx, cy, x, y, angle){
      var radians = (Math.PI / 180) * angle,
          cos = Math.cos(radians),
          sin = Math.sin(radians),
          nx = (cos * (x-cx)) + (sin * (y-cy)) + cx,
          ny = (cos * (y-cy)) - (sin * (x-cx)) + cy;
      
      return [nx,ny];//value * deg;
    }

    // let occupiedSiblings = peg.edges.filter(p => { return p.occupied });
    // let freeSpinning = occupiedSiblings.length < 2;
    let offset = 0;

    let offsetDirectionToggle = peg.clockwise;
    do {
      // let preColliding = false;
      // peg.occupiedSiblings().forEach(function(sibling){
      //   if( peg.verticies.length && sibling.verticies.length ) {
      //     preColliding = polygonsCollide(peg.verticies, sibling.verticies);
      //   }
      // });
      // console.log( {
      //   index: peg.index,
      //   preColliding: preColliding,
      //   offset: offset,
      //   clockwise: peg.clockwise,
      // });
      // offset = Math.pow( 2, offset );
      // offset++;
      // if( offset % 2 )
      //   offset *= -1;

      console.log( {
        index: peg.index,
        direction: peg.clockwise?"clockwise":"counter-clockwise",
        offset: offset,
        rotation: rotation,
      })
      peg.verticies = [];
      peg.verticies.push({x: cx, y: cy, toggle: false});
      // Calculate the verticies
      for (a=0; a <= pi2+2; a += angle) {

          let aOuter = aInner = [];
          // draw inner to outer line
          if (toggle) {
              aInner = rotate(cx, cy, cx + ( radiusI * (Math.cos(a - taperAI) ) ),
                                cy + ( radiusI * (Math.sin(a - taperAI) ) ),
                                rotation + offset);
              aOuter = rotate(cx, cy, cx + ( radiusO * (Math.cos(a + taperAO) ) ),
                                cy + ( radiusO * (Math.sin(a + taperAO) ) ),
                                rotation + offset)
          }

          // draw outer to inner line
          else {
              aOuter = rotate(cx, cy, cx + ( radiusO * (Math.cos(a - taperAO) ) ),
                                cy + ( radiusO * (Math.sin(a - taperAO) ) ),
                                rotation + offset);
              aInner = rotate(cx, cy, cx + ( radiusI * (Math.cos(a + taperAI) ) ),
                                cy + ( radiusI * (Math.sin(a + taperAI) ) ),
                                rotation + offset);
          }

          // Add both points to the peg's verticies.
          peg.verticies.push({x: aInner[0], y: aInner[1], toggle: toggle});
          peg.verticies.push({x: aOuter[0], y: aOuter[1], toggle: toggle});

          // switch level
          toggle = !toggle;
      }

      peg.occupiedSiblings().forEach(function(sibling){
        if( !colliding && peg.verticies.length && sibling.verticies.length ) {
          colliding = polygonsCollide(peg.verticies, sibling.verticies);
          console.log({
            'colliding': colliding,
            'peg.verticies': peg.verticies,
            'sibling.verticies': sibling.verticies,
          });
        }
      });

      // If we have rotated more than 36 degrees and can't get free from colliding break out.
      if( Math.abs(offset) > 36 )
        stuck = true;

      // if( colliding )
      //   offsetDirectionToggle = !offsetDirectionToggle;
      // else{
      //   // stop();
      //   // console.log()
      //   console.log({
      //     status: 'not stuck',
      //     index: peg.index,
      //     'offset': offset, 
      //     'offsetDirectionToggle': offsetDirectionToggle, 
      //     'peg.clockwise': peg.clockwise,
      //     'stuck': stuck,
      //   });
      // }

      if( colliding ){
        start(200);
      } else {
        start( 5 );
      }
      // if( stuck ){
        console.log({
          // status: 'not stuck',
          index: peg.index,
          'offset': offset, 
          'offsetDirectionToggle': offsetDirectionToggle, 
          'peg.clockwise': peg.clockwise,
          'stuck': stuck,
          colliding: colliding,
          peg: peg,
        });
      // }

    } while (false);// (colliding && !stuck);

    // console.log( {
    //   index: peg.index,
    //   offsetDirectionToggle: offsetDirectionToggle,
    //   clockwise: peg.clockwise,
    // })
    // peg.clockwise = offsetDirectionToggle;

    // console.log(colliding, peg.verticies);
    
    let alpha = .5;
    let alphaHex = "";
    if( occupied == 'maybe' ){
      let x = alpha * 255; 
      let y = Math.floor(x);  // int, e.g. y = 76
      let s = y.toString(16);
      alphaHex = y<16?'0'+s:s;
    }
    ctx.fillStyle = standardize_color(color) + alphaHex;//'#fff';
    ctx.beginPath();

    // move to starting point
    // ctx.moveTo(cx, cy);
    
    // Start Marker to add a line to see how the items are rotating
    ctx.lineWidth = 10;
    ctx.strokeStyle = 'white';
    startPoint = peg.verticies.shift();
    ctx.moveTo(startPoint.x, startPoint.y);
    secondPoint = peg.verticies.shift();
    ctx.lineTo(secondPoint.x, secondPoint.y);
    ctx.stroke();
    // End marker

    let lastPoint = {x:cx, y:cy};
    peg.verticies.forEach( function(point) {
      // ctx.lineTo( aInner[0], aInner[1] );
      // ctx.lineTo( aOuter[0], aOuter[1] );
      if( point.toggle ){
        // ctx.lineTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
        ctx.lineTo(lastPoint.x, lastPoint.y);
      }
      lastPoint=point;
    } );

    // loop
    // for (; a <= pi2+2; a += angle) {

    //     let aOuter = aInner = [];
    //     // draw inner to outer line
    //     if (toggle) {
    //         aInner = rotate(cx, cy, cx + ( radiusI * (Math.cos(a - taperAI) ) ),
    //                           cy + ( radiusI * (Math.sin(a - taperAI) ) ),
    //                           rotation);
    //         aOuter = rotate(cx, cy, cx + ( radiusO * (Math.cos(a + taperAO) ) ),
    //                           cy + ( radiusO * (Math.sin(a + taperAO) ) ),
    //                           rotation)
    //         ctx.lineTo( aInner[0], aInner[1] );
    //         ctx.lineTo( aOuter[0], aOuter[1] );
    //     }

    //     // draw outer to inner line
    //     else {
    //         aOuter = rotate(cx, cy, cx + ( radiusO * (Math.cos(a - taperAO) ) ),
    //                           cy + ( radiusO * (Math.sin(a - taperAO) ) ),
    //                           rotation);
    //         aInner = rotate(cx, cy, cx + ( radiusI * (Math.cos(a + taperAI) ) ),
    //                           cy + ( radiusI * (Math.sin(a + taperAI) ) ),
    //                           rotation);
    //         ctx.lineTo( aOuter[0], aOuter[1] );
    //         ctx.lineTo( aInner[0], aInner[1] );
    //     }

    //     // Add both points to the peg's verticies.
    //     peg.verticies.push({x: aInner[0], y: aInner[1]});
    //     peg.verticies.push({x: aOuter[0], y: aOuter[1]});

    //     // switch level
    //     toggle = !toggle;
    // }

    ctx.fill();
    // close the final line
    ctx.closePath();

    radiusH = radiusO / 4;

    // "erase" mode (term simplified)
    ctx.globalCompositeOperation = 'destination-out';

    // create circle (full arc)
    ctx.beginPath();
    ctx.moveTo(cx + radiusH, cy);
    ctx.arc(cx, cy, radiusH, 0, pi2);
    ctx.closePath();

    // creates the hole
    ctx.fill();

    // reset comp. mode
    ctx.globalCompositeOperation = 'source-over';

    // without filling/stroking, continue with:
    // Punch hole
    ctx.moveTo(cx + radiusH, cy);
    ctx.arc(cx, cy, radiusH, 0, pi2);

    // now fill using even-odd rule
    ctx.fill("evenodd");

    // ctx.translate(-cx, -cy);
    // ctx.restore();
    console.groupEnd();
  }

  // draws a grid
  function drawGrid(step){
    // draw a line every *step* pixels
    step = step || 25

    // our end points
    const width = canvas.width
    const height = canvas.height

    // set our styles
    ctx.save()
    ctx.strokeStyle = 'gray' // line colors
    ctx.fillStyle = 'black' // text color
    ctx.font = '14px Monospace'
    ctx.lineWidth = 0.35;

    const everyX = Math.floor( width / step );
    const everyY = Math.floor( height / step );

    // draw vertical from X to Height
    for (let x = 0; x < width; x += step) {
      // draw vertical line
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()

      if( x % everyX === 0 ){
        // draw text
        ctx.fillText(x, x, 12)
      }
    }

    // draw horizontal from Y to Width
    for (let y = 0; y < height; y += step) {
      // draw horizontal line
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()

      if( y % everyY === 0 ){
        // draw text
        ctx.fillText(y, 0, y)
      }
    }

    // restore the styles from before this function was called
    ctx.restore()
  }

  function drawPeg( left, top, init ){
    const size = 75;

    // filled square X: 125, Y: 35, width/height 50
    ctx.beginPath()

    ctx.strokeStyle = 'red'
    ctx.fillStyle = 'black';
    ctx.lineWidth = 10;
    // ctx.rect(x, y, size, size);

    ctx.arc(left + (size /2), top + (size /2), 15, 0, 2 * Math.PI, false) // full circle

    // ctx.rect(200, 35, 50, 50)
    ctx.fill()
    // ctx.stroke()
    if( init ){
      cogs.push({
        left: left,
        top: top,
        width: size,
        height: size,
        centerX: left + (size/2),
        centerY: top + (size/2),
      });
    }
  }

  function drawPegs(maxWidth, init){
    maxWidth = maxWidth || 15;
    // const size = 75;
    const size = 80;

    // our end points
    const width = canvas.width
    const height = canvas.height

    ctx.save();
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
        ctx.beginPath()

        ctx.strokeStyle = 'red'
        ctx.fillStyle = 'black';
        ctx.lineWidth = 10;
        // ctx.rect(x, y, size, size);

        ctx.arc(left + (size /2), top + (size /2), 15, 0, 2 * Math.PI, false) // full circle

        // ctx.rect(200, 35, 50, 50)
        // ctx.fillStyle = y%2 ? "pink":"green";
        // ctx.rect(left, top, size, size);
        ctx.fill();

        ctx.fillStyle = 'orange';
        ctx.font = "30px Arial";
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle'; 
        ctx.fillText(peg, left + (size /2), top + (size /2));

        // ctx.stroke()
        if( init ){
          if( !cogs[y] )
            cogs[y] = [];
          if( !cogs[y][x] )
            cogs[y][x] = {};

          let obj = {
            x: x,
            y: y,
            left: left,
            top: top,
            width: size,
            height: size,
            centerX: left + (size/2),
            centerY: top + (size/2),
            edges: [],
            verticies: [],
            index: pegs.length,
            occupied: false,
            clockwise: true,
            occupiedSiblings: function () {return this.edges.filter(p => { return p.occupied })},
          };
          cogs[y][x] = obj;
          pegs.push(obj);

          // Up left
          if( cogs[y-1] && cogs[y-1][x-1] ){
            // Add to remote
            pegs[cogs[y-1][x-1].index].edges.push(obj);

            // Add locally
            obj.edges.push(cogs[y-1][x-1]);
          }

          // Up right
          if( cogs[y-1] && cogs[y-1][x] ){
            // Add to remote
            pegs[cogs[y-1][x].index].edges.push(obj);

            // Add locally
            obj.edges.push(cogs[y-1][x]);
          }

          // Left
          if( cogs[y] && cogs[y][x-1] ){
            // Add to remote
            pegs[cogs[y][x-1].index].edges.push(obj);

            // Add locally
            obj.edges.push(cogs[y][x-1]);
          }

          // previous row same column = up right
          // same row previous column
          // console.log( pegs );
        }
        peg++;
      }
    }
    ctx.restore();
  }

  drawCanvas(true);

  let playing = false;
  let playingInterval = null;

  function once(){drawCanvas(false);}
  function start( speed ){
    if( playing ) stop();

    playing = true;
    playingInterval = setInterval(function(){
      drawCanvas(false);
    }, speed ?? 36);
  }

  function stop(){
    if( !playing )
      return;
    playing = false;
    clearInterval( playingInterval );
  }


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
// })();