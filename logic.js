// index.js
// ;(function () {
  const canvas = document.getElementById('gameBoard')
  const ctx = canvas.getContext('2d');

  let cogs = [];
  let pegs = [];
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
    drawPegs(5, init);

    updateScore();
    setTeamIndicator();

    pegs.filter(p => p.occupied).forEach(function(peg){
      let fillStyle = teams[peg.team].fillStyle || 'purple';
      // drawCog(peg.centerX, peg.centerY, fillStyle, peg.occupied);
      drawCog(peg, fillStyle);
    });
  }

  let draws = 0;
  function setTeamIndicator(){
    ctx.save();
    ctx.beginPath();
    let nextTeam = advanceTeam();
    ctx.fillStyle = teams[nextTeam].fillStyle;
    ctx.fillRect(0, 0, 50, 50);

    ctx.font = "30px Arial";
    ctx.fillText(draws++, canvas.width, canvas.height); 

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
      console.log( team.cogs, pegsOnBoard, team );
      ctx.fillText(`${team.name} has ${cogsLeft} left`, 100, 100+(i*50)); 
    })

    ctx.restore();
  }

  function drawCog(peg, color){
    let x = peg.centerX;
    let y = peg.centerY;
    let occupied = peg.occupied;
    console.log( x, y, color, occupied );

    // console.log( 'drawing ' + color + ' cog' );
    // Draw the cogs
    var cx      = x,                  // center x
    cy      = y,                      // center y
    size    = 50,                     // how big to make the cog
    notches = 9,                      // num. of notches
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

    ctx.beginPath();

    let alpha = .5;
    let alphaHex = "";
    if( occupied == 'maybe' ){
      let x = alpha * 255; 
      let y = Math.floor(x);  // int, e.g. y = 76
      let s = y.toString(16);
      alphaHex = y<16?'0'+s:s;
    }

    ctx.fillStyle = standardize_color(color) + alphaHex;//'#fff';
    // move to starting point
    ctx.moveTo(cx + radiusO * Math.cos(taperAO), cy + radiusO * Math.sin(taperAO));

    // loop
    for (; a <= pi2+2; a += angle) {

        // draw inner to outer line
        if (toggle) {
            ctx.lineTo(cx + radiusI * Math.cos(a - taperAI),
                       cy + radiusI * Math.sin(a - taperAI));
            ctx.lineTo(cx + radiusO * Math.cos(a + taperAO),
                       cy + radiusO * Math.sin(a + taperAO));
        }

        // draw outer to inner line
        else {
            ctx.lineTo(cx + radiusO * Math.cos(a - taperAO),  // outer line
                       cy + radiusO * Math.sin(a - taperAO));
            ctx.lineTo(cx + radiusI * Math.cos(a + taperAI),  // inner line
                       cy + radiusI * Math.sin(a + taperAI));
        }

        // switch level
        toggle = !toggle;
    }

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

    // stroke
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'black';
    // ctx.stroke();
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
    ctx.lineWidth = 0.35

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
    let center = width / 2;
    let offset = size / 2;


    for( y = 0; y <= maxWidth; y++){
      for( x = 0; x <= y; x++){
        const top = (y*size) + offset; // make sure we don't get too close to the top
        const left = ( x - (y / 2) ) * size + (center-offset); // position this in teh center of the canvas
        // drawPeg(left, top, init);
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
          if( !cogs[x] )
            cogs[x] = [];
          if( !cogs[x][y] )
            cogs[x][y] = [];

          let obj = {
            x: x,
            y: y,
            left: left,
            top: top,
            width: size,
            height: size,
            centerX: left + (size/2),
            centerY: top + (size/2),
          };
          cogs[x][y].push(obj);
          pegs.push(obj);
        }
      }
    }
    ctx.restore();
  }

  drawCanvas(true);
// })();