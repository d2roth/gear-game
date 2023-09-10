// import Game from '../modules';
// const Game = require("../modules/Game");
const Game = require("../algo");

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
        expect( game.positions.nodes.get(1).data.team ).toBe( 'red' );
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

    it("Pieces can't be placed if game is not started", () => {
        const startingSize = game.positions.size;
        expect(game.isRunning()).toBe(false);
        game.place(1, 'red');
        expect(game.positions.size).toEqual(startingSize);

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
            const node1 = game.positions.getVertex(index1);
            const node2 = game.positions.getVertex(index2);
            expect(node1.isAdjacent(node2)).toBe(true);
            expect(node2.isAdjacent(node1)).toBe(true);
        }
    )
})

describe("Test Cycles", () => {

    const cases = [
        // [[1,2,3], true],
        [[1,2,4], false],
        [[1,2,5], true],
        // [[4,7,12,13,9,5], true],
        // [[4,7,12,13,9,6], false],
    ];

    test.each(cases)(
        "given a loop with %p run a cycle test and check that it is %p",
        (places, isCycle) => {
            const game = new Game(places.length);
            places.forEach(place => {
                game.place(place, 'red');
            });
            expect( game.hasCycle() ).toBe(isCycle);
        }
    )
    // const game = new Game(5);

    // it("Small circle has cycle", () =>{
    //     // Place our pieces
    //     game.place(1, 'red');
    //     game.place(2, 'red');
    //     game.place(3, 'red');

    //     expect( game.hasCycle() ).toBe( true );

    // })
})

describe("Building a board with different rows", () => {

    const cases = [[2,3], [5,15]];

    test.each(cases)(
        "given %p rows returns a board with %p items",
        (arg, expectedResult) => {
            const result = new Game(arg);
            // console.log( result );
            expect(result.positions.nodes.size).toEqual(expectedResult);
        }
    );
})