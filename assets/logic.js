const tree = document.querySelector("#tree");
let nodes = {};

// let board = [
//   [0,0],
//   [0,1],
//   [2,3],
//   [4,5],
//   [4,6],
//   [2,7],
//   [3,5],
// ];
let board = [
  [[1,1],[1,2]],
  [[1,2],[2,2]],
  [[2,2],[2,3]]
];
// let board = [
//   ['a','b'],
//   ['b','c'],
//   ['c','a'],
//   ['a','d']
// ];

let map = new Map();
let paths = new Map();

board.forEach(item => {
  let [x, y] = item;
  // console.group(`Handling the item: [${item.join(",")}]`);
  // console.log( x, y, item )

  if( typeof x !== "string" )
   x = JSON.stringify(x);
  
  if( typeof y !== "string" )
   y = JSON.stringify(y);
  
  if( map.has(x) ){
    // console.log( `Map has x so adding y to it`)
    map.get(x).push(y)
  } else {
    // console.log( `Map doesn't have x so adding ${y} to ${x}`)
    map.set(x, [y])
  }
  if( map.has(y) ) {
    // console.log( `Map has y so adding x to it`)
    map.get(y).push(x);
  } else {
    // console.log( `Map doesn't have y so adding ${x} to ${y}`)
    map.set(y, [x])
  }

  // console.groupEnd();
})
// console.log( map );
let touched = new Map();

map.forEach( (edges, startKey ) => {
  // console.group(`Working through ${startKey}`)

  edges.forEach( edge => {
    // console.group( `Working on edge ${edge}` );
    if( touched.has(startKey) ){
      // console.log( `We already touched edge: ${edge}`)
      touched.get(startKey).push(edge);
    } else {
      // console.log( `We haven't touched edge: ${edge}`)
      touched.set(startKey, [edge]);
    }
    // console.groupEnd();
  })
  // console.groupEnd();
});

// function loopThrough( key, chains = new Map ){
//   console.group(`We are starting on ${key} and our chain is ${chains.entries()}`)

//   if( touched.has( key ) ){
//     if( !chains.has(key) )
//       chains.set(key, [])
//     else 
//       chains.get(key).push( key )

//     touched.get(key).forEach( key2 => {
//       loopThrough( key2, chains );
//     })
//     // chains.push(loopThrough(touched.get(key), chains));
//   }

//   return chains;
// }
// console.log( loopThrough("[1,2]") );

touched.forEach( (edges, self) => {
  console.group(`I am ${self} and I touch ${edges.join(" and ")}`);

  let chain = [];
  let item = self;
  let i = 0;
  while (item && chain.length < 10 && i < 10){

    if( chain.indexOf( item ) === -1 ){
      console.log( `${chain.join("...")} does not contain ${item}`)
      chain.push(item);
    }

    if( touched.has(item) )
      item = touched.get(item);

    i++;
  }
  console.log( `That now gives us a chain with ${chain.join("->")}`);

  // Go through the edges of self and find what else we touch
  edges.forEach( edge => {
    console.group( `Well... I touch ${edge} so what does it touch?`);

    if( touched.has( edge ) ){
      console.log( `Oh? ${edge} also touches ${touched.get(edge).join( " and " )}. That is intersting...`);
    }

    console.groupEnd();
  })
  console.groupEnd();
})

// map.forEach( (edges, startKey ) => {
//   console.group(`Working through ${startKey}`);
//   edges.forEach( edge => {
//     // console.log( `${startKey} touches ${edge}` );
//     console.group( `followingChain ${edge}` );

//     if( touched.has( edge ) ){
//       console.log(`We already touched edge: ${edge} so just add on ${startKey}`)
//       touched.get(edge).push( startKey );
//     } else {
//       console.log( `We haven't touched edge: ${edge} so initalizing it with ${startKey}.`)
//       touched.set( edge, [startKey] );
//     }

//     if( touched.has(startKey) ) {
//       console.log(`We already touched startKey: ${startKey} so just add on ${edge}`)
//       touched.get( startKey ).push(edge)
//     } else {
//       console.log( `We haven't touched startKey: ${startKey} so initalizing it with ${edge}.`)
//       touched.set( startKey, [edge] );
//     }
//     console.groupEnd();
//   })
//   console.groupEnd()
// });

console.log( touched );

// map.forEach( (edges, x) => {
//   console.group(`Handling ${x} with edges [${edges.join(",")}]`);
//   // console.log( {
//   //   edges: edges,
//   //   x: x,
//   // });

//   edges.forEach( edge => {
//     if( map.has( edge ) ){
//       console.log( `Map has edge: ${edge}. Checking if this connection exists there.`)
//       // Check if we have this connection
//       if( map.get(edge).has(x) ) {
//         map.get(edge).get(x).push(m)
//       } else {
//         map.get(edge).set(x, m)
//       }
//     } else {
//       console.log( `Map doesn't have edge: ${edge}. Adding ${x} now.`)
//       map.set(edge, [x]);
//     }
//   })
//   console.groupEnd();
// })

// console.log( map );

