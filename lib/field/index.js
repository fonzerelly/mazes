const {
    cell
} = require('../cell');

const {
    fromNullable
} = require('data.maybe');

const {
    curry
} = require('core.lambda');

module.exports = {
    field: (rows, columns) => {
        return Array.apply(null, Array(rows)).map((_, i) => {
            return Array.apply(null, Array(columns)).map((_, j) => {
                return cell(i, j);
            });
        });
    },
    neighbours: (container, a) => {
        
        const safeAccess = curry(2, (index, array) =>{
            return fromNullable(array[index]);
        });
        
        function safeCell(r, c) {
            const row = safeAccess(r, container);
            return row.chain(safeAccess(c))
        }
        return {
            north: safeCell(a.row - 1, a.column),
            south: safeCell(a.row + 1, a.column),
            west: safeCell(a.row, a.column - 1),
            east: safeCell(a.row, a.column + 1)
        };
    },
    size: (container) =>  container.length ? container.length * container[0].length : 0,
    randomCell: (container, seed) => {
        const randomRow = container[Math.floor(Math.random() * container.length)];
        return randomRow[Math.floor(Math.random() * randomRow.length)];
    },
    reduceCells: (container, fn, init) => {
        container.forEach((row) => {
            row.forEach((cell) => {
                init = fn(init, cell);        
            });
        });
        return init;
    }
}