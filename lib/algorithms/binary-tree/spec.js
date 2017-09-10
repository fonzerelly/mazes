const {
    field,
    reduceCells,
    neighbours
} = require('../../field')
const {
    linksOf
} = require('../../cell')
const {
    binaryTree
} = require('./index')

describe('binary-tree', () => {

    let maze = field(3,3), linkContainer;
    beforeAll(() => {
        const north = 0.3; //values below 0.5 should take north
        const east = 0.7; //values aboe 0.5 should take east
        
        //entries in the first row always will head east despite these fake random values
        //entries in the last column will always head north despite these fake random values 
        const randomValues = [  //_______
            east, north, east,  //|  _  |
            north, east, north, //| |_  | 
            north, east, east   //|_|___|
        ];
        spyOn(Math, 'random').and.callFake(() => randomValues.shift());
        linkContainer = binaryTree(maze);
    });
    reduceCells(maze, (_, cell) => {
        it(`should link cell[${cell.row}][${cell.column}]`, () => {
            expect(linksOf(linkContainer, cell).length).toBeGreaterThan(0);
        });
    }, null);
    describe('expectedDirection', () => {
        [
            ['east',  'east', 'none' ],
            ['north', 'east', 'north'],
            ['north', 'east', 'north']
        ].forEach((row, ri) => {
            row.forEach((direction, ci) => {
                it(`of cell [${ri}, ${ci}] should be ${direction}`, () => {
                    if (direction == 'none') {
                        return;
                    }
                    expect(linksOf(linkContainer, maze[ri][ci]))
                        .toContain(neighbours(maze, maze[ri][ci])[direction].get())
                })
            });
        });
    });
});