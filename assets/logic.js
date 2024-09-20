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
// let board = [
//   [[1,1],[1,2]],
//   [[1,2],[2,2]],
//   [[2,2],[2,3]],
//   [[5,5],[1,1]],
// ];
let board = [
  ['a','b'],
  ['b','c'],
  ['c','a'],
  ['a','d']
];

let map = new Map();
let paths = new Map();

board.forEach(item => {
  let [xKey, yKey] = item;
  
  x = {
    key: typeof xKey === "string" ? xKey : JSON.stringify(xKey),
    visited: false,
  }
  y = {
    key: typeof yKey === "string" ? yKey : JSON.stringify(yKey),
    visited: false,
  }
  map.has(x.key) ? map.get(x.key).push(y) : map.set(x.key, [y])
  map.has(y.key) ? map.get(y.key).push(x) : map.set(y.key, [x])
})

// console.log( map );
let touched = new Map();

function walkTree( startKey, tree, visits ){
  if( tree.get(startKey).visited )
    console.log( `Already visited ${startKey}` )

  console.group(`Given the startKey of ${startKey} we are walking through...`)
  visits.push(startKey)

  // Mark this node as visited
  tree.get(startKey).visited = true;
  tree.get(startKey).edges = [];
  tree.get(startKey).map( edge => {
    // If the last node is the same as this edge skip
    if( visits.at(-2) == edge.key )
      return;

    console.group(`Working on edge ${edge.key} from ${Array.from(tree.get(startKey)).length} possibilities on the path ${visits.join("=>")}`)

    if( tree.get(edge.key).visited ){
      console.log( `We already visited ${edge.key}` );
      visits.push(edge.key);
    }

    // If we don't have this edge or it hasn't been visited then walk through
    if( visits.indexOf(edge.key) === -1 || !tree.get(edge.key).visited ){
      walkTree(edge.key, tree, visits)
    } else {
      tree.get(edge.key).edges.push(visits)
      visits = [];
    }

    console.groupEnd();
  })
  console.log( `Now our visits looks like ${visits.join("->")}` );
  console.groupEnd();
}

map.forEach( (edges, startKey ) => {
  console.group(`Starting the map with the edge: ${startKey}`)

  walkTree(startKey, map, [] );
  // edges.forEach( edge => {
  //   // console.group( `Working on edge ${edge}` );
  //   if( touched.has(startKey) ){
  //     // console.log( `We already touched edge: ${edge}`)
  //     touched.get(startKey).push(edge);
  //   } else {
  //     // console.log( `We haven't touched edge: ${edge}`)
  //     touched.set(startKey, [edge]);
  //   }
  //   // console.groupEnd();
  // })
  console.groupEnd();
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
  console.group(`Processing`)
  while (item && chain.length < 10 && i < 10){
    console.log( `Current Item: ${item}` )
    if( chain.indexOf( item ) === -1 ){
      console.log( `{${chain.join("...")}} does not contain ${item}`)
      chain.push(item);
    }

    if( touched.has(item) )
      item = touched.get(item);

    i++;
  }
  console.groupEnd();
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


map.forEach( (children, parent) => {
  console.log(parent, children);
  let wrapper = document.createElement('ul');
  let content = "";
  content += `<li>${parent}<ul>`;

  children.forEach(child => {
    content += `<li>${child.key}</li>`;
  });

  content += `</ul></li>`;
  wrapper.innerHTML = content;

  tree.append(wrapper);
})