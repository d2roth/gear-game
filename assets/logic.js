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
  // Triangle
  [[1,1],[1,2]],
  [[1,2],[1,3]],
  [[1,3],[2,2]],
  [[2,2],[1,2]],
  [[1,1],[2,1]],

  // Straight line
  [[1,4],[2,4]],

  // Single dot
  [[1,5]]
];
// let board = [
//   ['a','b'],
//   ['b','c'],
//   ['c','a'],
//   ['a','d']
// ];

let map = new Map();
let paths = new Map();

board.forEach(path => {
  let [x, y] = path;
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
console.log(map);
function findTheEnd(start, last, chain){
  chain = chain ?? [];
  console.group(`Finding the end from ${start}.`)
  if( map.has(start) ){

    if( !map.get(start).handled ){
      map.get(start).handled = true;
      map.get(start).forEach(edge => {
        if( edge != last ){
          console.log(`We are adding ${edge} to ${chain.join("->")}`)
          let hasNode = chain.indexOf(edge) !== -1;
          if( !hasNode ){
            chain.push(edge);
            findTheEnd(edge, start, chain);
          }
        } else {
          // console.log( `We just handled ${edge}`)
        }
      })
    } else {
      map.get(start).loop = true;
      console.log( `Already handled this one and it isn't the one we came from`)
    }
    if( map.get(start).chains ) {
      map.get(start).chains.push( chain );
    } else {
      map.get(start).chains = [chain]
    }
  }
  console.groupEnd();
  // map.forEach( (edges,self) => {
  //   console.group(`Location ${self} has ${edges.length} piece(s) that it touches which are ${edges.join(",")}`)
  //   edges.forEach( edge => {
  //     console.group( `Edge ${edge} ${map.has(edge) ? "has" : "does not have"} more`)
  //     // if( map.has(edge) ){
  //     //   console.log( ``)
  //     // }
  //     console.groupEnd();
  //   })
  //   console.groupEnd();
  // })
  // console.groupEnd();
}
Array.from(map.entries()).forEach(e => {
  if( !e[1].handled )
    findTheEnd(e[0]);

})

console.log( Array.from(map.entries()).filter(e => e.loop))

// map.forEach( (edges, startKey ) => {
//   // console.group(`Working through ${startKey}`)
//   console.log(`setting every edge that ${startKey} touches. ${edges.join("==")}`)
//   edges.forEach( edge => {
//     // console.group( `Working on edge ${edge}` );
//     if( touched.has(startKey) ){
//       // console.log( `We already touched edge: ${edge}`)
//       touched.get(startKey).push(edge);
//     } else {
//       // console.log( `We haven't touched edge: ${edge}`)
//       touched.set(startKey, [edge]);
//     }
//     // console.groupEnd();
//   })
//   // console.groupEnd();
// });


// // function loopThrough( key, chains = new Map ){
// //   console.group(`We are starting on ${key} and our chain is ${chains.entries()}`)

// //   if( touched.has( key ) ){
// //     if( !chains.has(key) )
// //       chains.set(key, [])
// //     else 
// //       chains.get(key).push( key )

// //     touched.get(key).forEach( key2 => {
// //       loopThrough( key2, chains );
// //     })
// //     // chains.push(loopThrough(touched.get(key), chains));
// //   }

// //   return chains;
// // }
// // console.log( loopThrough("[1,2]") );

// touched.forEach( (edges, self) => {

//   let chain = [];
//   let item = self;
//   console.group(`I am ${item} and I touch ${edges.join(" and ")}`);
//   let i = 0;

//   while (item && chain.length < 10 && i < 10){

//     console.log( `We have touched ${Array.from(touched.entries()).join("_")}`)
//     if( chain.indexOf( item ) === -1 ){
//       console.log( `The chain (${chain.join("...")}) does not contain ${item}`)
//       chain.push(item);
//     }

//     console.log( 'we just handled ' + item + ' on our chain: ' + chain.join("=>"))
//     if( touched.has(item) ){
//       item = touched.get(item);
//     }

//     i++;
//   }
//   console.log( `That now gives us a chain with ${chain.join("->")}`);

//   // Go through the edges of self and find what else we touch
//   edges.forEach( edge => {
//     console.group( `Well... I touch ${edge} so what does it touch?`);

//     if( touched.has( edge ) ){
//       console.log( `Oh? ${edge} also touches ${touched.get(edge).join( " and " )}. That is intersting...`);
//     }

//     console.groupEnd();
//   })
//   console.groupEnd();
// })

// // map.forEach( (edges, startKey ) => {
// //   console.group(`Working through ${startKey}`);
// //   edges.forEach( edge => {
// //     // console.log( `${startKey} touches ${edge}` );
// //     console.group( `followingChain ${edge}` );

// //     if( touched.has( edge ) ){
// //       console.log(`We already touched edge: ${edge} so just add on ${startKey}`)
// //       touched.get(edge).push( startKey );
// //     } else {
// //       console.log( `We haven't touched edge: ${edge} so initalizing it with ${startKey}.`)
// //       touched.set( edge, [startKey] );
// //     }

// //     if( touched.has(startKey) ) {
// //       console.log(`We already touched startKey: ${startKey} so just add on ${edge}`)
// //       touched.get( startKey ).push(edge)
// //     } else {
// //       console.log( `We haven't touched startKey: ${startKey} so initalizing it with ${edge}.`)
// //       touched.set( startKey, [edge] );
// //     }
// //     console.groupEnd();
// //   })
// //   console.groupEnd()
// // });

// console.log( touched );

// // map.forEach( (edges, x) => {
// //   console.group(`Handling ${x} with edges [${edges.join(",")}]`);
// //   // console.log( {
// //   //   edges: edges,
// //   //   x: x,
// //   // });

// //   edges.forEach( edge => {
// //     if( map.has( edge ) ){
// //       console.log( `Map has edge: ${edge}. Checking if this connection exists there.`)
// //       // Check if we have this connection
// //       if( map.get(edge).has(x) ) {
// //         map.get(edge).get(x).push(m)
// //       } else {
// //         map.get(edge).set(x, m)
// //       }
// //     } else {
// //       console.log( `Map doesn't have edge: ${edge}. Adding ${x} now.`)
// //       map.set(edge, [x]);
// //     }
// //   })
// //   console.groupEnd();
// // })

// // console.log( map );

