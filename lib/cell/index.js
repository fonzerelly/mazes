var filter = Array.prototype.filter.call.bind(Array.prototype.filter);
const {
    curry,
    compose
} = require('core.lambda');

const {
    unary
} = require('core.arity');

const {
    not
} = require('core.operators');

const equalLink = curry (3, (a, b, link) => {
    return (
       (link[0] === a || link[0] === b) &&
       (link[1] === a || link[1] === b)
    ); 
});

function isLinked (container, a, b) {
    return container
        .filter(unary(equalLink(a, b)))
        .length > 0;
}

function unlink(container, a, b) {
    return container.filter(unary(compose(not)(equalLink(a,b))));
}

module.exports = { 
    //number -> number -> {row, column}
    cell: function cell (row, column) {
        return {
            row: row,
            column: column
        }
    },

    //[[Cell, Cell]] -> Cell -> Cell -> boolean
    isLinked: isLinked,

    //[[Cell, Cell]] -> Cell -> Cell -> Either<[[Cell, Cell]]
    link: function link (container, a, b) {
        if (isLinked(container, a, b)) return container;
        const clone = container.slice(0);
        clone.push([a,b])
        return clone;
    },
    //[[Cell, Cell]] -> Cell -> Cell -> Either<[[Cell, Cell]]
    unlink: unlink,

    linksOf: function(container, a) {
        return container.filter((link) => 
            link[0] === a || link[1] === a
        ).reduce((acc, link) => {
            if (link[0] !== a) acc.push(link[0])
            if (link[1] !== a) acc.push(link[1])
            return acc;
        }, [])
    }
};