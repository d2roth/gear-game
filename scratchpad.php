<?php

$nodes = [];
$pegs = 3*7;
$row = 0;
$peg = 0;

$nodes = array_fill(1, $pegs, []);
$row = 1;
$column = 1;
$rows = [];

$verticies = [];

do {

  for( $column = 1; $column <= $row; $column++ ){
    $peg++;
    // $nodes[$peg][] = [
    //   'column' => $column,
    // ];
    // $nodes[$column+$row][] = $column;

    // Previous row
    if( isset( $rows[$row-1] ) ){

      // Up to the left
      if( isset( $rows[$row-1][$column-1] ) ){
        // Set on the remote node
        $nodes[$peg]['verticies'][] = $rows[$row-1][$column-1];

        // Set on this node
        $nodes[$rows[$row-1][$column-1]]['verticies'][] = $peg;
      }

      // Up to the right
      if( isset( $rows[$row-1][$column] ) ){
        // Set on the remote node
        $nodes[$peg]['verticies'][] = $rows[$row-1][$column];

        // Set on this node
        $nodes[$rows[$row-1][$column]]['verticies'][] = $peg;
      }
    }

    // Same row 
    if( isset( $rows[$row] ) ) {
      if( isset( $rows[$row][$column-1] ) ){
        // Set on the remote node
        $nodes[$peg]['verticies'][] = $rows[$row][$column-1];

        // Set on this node
        $nodes[$rows[$row][$column-1]]['verticies'][] = $peg;
      }
    }

    $rows[$row][$column] = $peg;

    // Graph is build correctly....
    // echo $peg . ' is on row ' . $row . ' at column ' . $column . "<br>";
    
    echo "row" . $row . ' => ' . $peg . "<br>";
  }

  $row++;

} while( $peg < $pegs );
var_dump($rows);

// for ( $count = 1; $count <= $pegs; $count++ ){
//   for( $column = 1; $column <= $width; $column++ ){
//     if( $column == $width ){
//       $width++;
//     }
//     var_dump($column. "=" . $width . "=" . $row);
//     $peg++;

//     $nodes[$peg][] = $row + $column;

//     echo $peg . ' is on row ' . $row . ' at column ' . $column . "<br>";
//   }
// }

var_dump( $nodes );