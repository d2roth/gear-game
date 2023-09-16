// import Game from '../modules';
// const Game = require("../modules/Game");
// const Game = require("../algo");

// const Node = require( "../modules/Node" );
// const Game = require( "../modules/Game" );
const Stack = require( "../modules/Stack" );
const Game = require( "../modules/Game" );
const Node = require( "../modules/Node" );

test( "Testing stack works", () => {
    const stack = new Stack();
    expect( stack.isEmpty() ).toBe(true);
    stack.add("Something");
    expect( stack.size ).toEqual(1);
    expect( stack.isEmpty() ).toBe(false);
})

describe("Testing basic game setup", () => {
    const game = new Game();

    it("Unstarted game is correct state", () => {
        expect(game.state).toBe("not_started");
        expect(game.isRunning()).toBe(false);
        expect(game.current_turn).toBe(0);
    });
})

describe("Making a play", () => {
    const game = new Game(3);
    it("Making a play", () => {
        game.place(1, 'red');
        expect( game.pegs.getVertex(1).team ).toBe( 'red' );
    });
})

describe("Changing game state", () => {
    const game = new Game(3);

    // Needs to be run before tests to start the game
    it("Placing piece does not start game", () =>{
        game.place(1, 'red');
        expect(game.isRunning()).toBe(false);
    })

    it("Starting game changes game state", () => {
        game.startGame();
        expect(game.isRunning()).toBe(true);
    });
})

describe("Taking turns", () => {
    const game = new Game(3);

    it("Pieces can be placed if game is not started", () => {
        const startingSize = game.pegs.size;
        expect(game.isRunning()).toBe(false);
        expect(() => {
            game.place(1, 'red')
        }).not.toThrow(/game is not running/);
        expect(game.pegs.size).toEqual(startingSize);
    })
})
describe("Verticies are connected", () => {
    const game = new Game(5);
    const cases = [
        // Row 1
        [1,2], [1,3],
        // Row 2
        [2,1],[3,1],[3,2],
        // Row 3
        [4,2],[5,2],[5,3],[5,4],[6,3],[6,5],
        // Row 4
        [7,4],[8,4],[8,5],[8,7],[9,5],[9,6],[9,8],[10,6],[10,9],
        // Row 5
        [11,7],[12,7],[12,8],[12,11],[13,8],[13,9],[13,12],[14,9],[14,10],[14,13],[15,10],[15,14],
    ];

    test.each(cases)(
        "%p connects to %p",
        (index1, index2) => {
            const node1 = game.pegs.getVertex(index1);
            const node2 = game.pegs.getVertex(index2);
            expect(node1.isAdjacent(node2)).toBe(true);
            expect(node2.isAdjacent(node1)).toBe(true);
        }
    )
})

describe("Test Cycles", () => {

    const cycle_check = [
        [[1,2,3], true],
        [[1,2,4], false],
        [[1,2,5], false],
        [[4,7,12,13,9,5], true],
        [[4,7,12,13,9,6], false],
    ];

    test.each(cycle_check)(
        "given pegs in %p run a cycle test and check that it is %p",
        (places, isCycle) => {
            const game = new Game(places.length);
            places.forEach(place => {
                game.place(place, 'red');
            });
            expect( game.hasCycle() ).toBe(isCycle);
        }
    )
})

describe.only("Test Rotation", () => {

    const cycle_rotations = [
        // [[1,2,4],           Node.DIRECTION_CLOCKWISE,   Node.DIRECTION_CLOCKWISE],
        // [[1,2,5],           Node.DIRECTION_CLOCKWISE,   Node.DIRECTION_CLOCKWISE],
        // [[1,2,4,7],         Node.DIRECTION_CLOCKWISE,   Node.DIRECTION_COUNTER_CLOCKWISE],
        // [[1,2,4,5],         Node.DIRECTION_STUCK,       Node.DIRECTION_STUCK],
        // [[4,7,12,13,9,5],   Node.DIRECTION_CLOCKWISE,   Node.DIRECTION_COUNTER_CLOCKWISE],
        // [[4,7,12,13,9,6],   Node.DIRECTION_CLOCKWISE,   Node.DIRECTION_COUNTER_CLOCKWISE],

        // Moved to the end to speed up debug testing
        [[1],               Node.DIRECTION_CLOCKWISE,   Node.DIRECTION_CLOCKWISE],
        [[1,2],             Node.DIRECTION_CLOCKWISE,   Node.DIRECTION_COUNTER_CLOCKWISE],
        [[1,2,3],           Node.DIRECTION_STUCK,       Node.DIRECTION_STUCK],
    ];

    test.each(cycle_rotations)(
        "given pegs in %p start twisting the first one should turn: %p and the last should turn: %p",
        (places, firstDirection, lastDirection) => {
            const game = new Game(places.length);

            places.forEach(place => {
                game.place(place, 'red');
            });

            let lastPlace = places[places.length-1];
            let firstPlace = places[0];
            game.pegs.getVertex(firstPlace).spin();
            expect( game.pegs.getVertex(firstPlace).direction ).toBe(firstDirection);
            expect( game.pegs.getVertex(lastPlace).direction ).toBe(lastDirection);
        }
    )
})

describe("Building a board with different rows", () => {

    const cases = [[2,3], [5,15]];

    test.each(cases)(
        "given %p rows returns a board with %p items",
        (arg, expectedResult) => {
            const result = new Game(arg);
            // console.log( result );
            expect(result.pegs.nodes.size).toEqual(expectedResult);
        }
    );
})