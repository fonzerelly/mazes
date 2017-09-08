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

const {
    Nothing,
    Just
} = require('data.maybe');

const equalLink = curry (3, (a, b, link) => {
    return (
       (link[0] === a || link[0] === b) &&
       (link[1] === a || link[1] === b)
    ); 
});

const inArray = curry (2, (elem, array) => {
    return array.indexOf(elem) >= 0;
});

const equalLinkMaybe = curry (3, (maybeA, maybeB, maybeLink) => {
    return (
        Just(inArray(maybeA.getOrElse(undefined))).ap(maybeLink).getOrElse(false) &&
        Just(inArray(maybeB.getOrElse(undefined))).ap(maybeLink).getOrElse(false)
    );
});

function isLinked (container, a, b) {
    return container
        .filter(unary(equalLink(a, b)))
        .length > 0;
}


function isLinkedMaybe (container, maybeA, maybeB) {
    return container
        .filter(unary(equalLinkMaybe(maybeA, maybeB)))
        .length > 0;
}

function unlink(container, a, b) {
    return container.filter(unary(compose(not)(equalLink(a,b))));
}

function unlinkMaybe(container, maybeA, maybeB) {
    return container.filter(unary(compose(not)(equalLinkMaybe(maybeA, maybeB))));
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
    isLinkedMaybe: isLinkedMaybe,

    //[[Cell, Cell]] -> Cell -> Cell -> Either<[[Cell, Cell]]
    link: function link (container, a, b) {
        if (isLinked(container, a, b)) return container;
        const clone = container.slice(0);
        clone.push([a,b])
        return clone;
    },

    linkMaybe: function(container, maybeA, maybeB) {
        if (maybeA.isNothing || maybeB.isNothing) return container;
        if (isLinkedMaybe(container, maybeA, maybeB)) return container;

        const clone = container.slice(0);
        clone.push(Just([maybeA.get(), maybeB.get()]))
        return clone;
    },
    //[[Cell, Cell]] -> Cell -> Cell -> Either<[[Cell, Cell]]
    unlink: unlink,
    unlinkMaybe: unlinkMaybe,

    //[[Cell, Cell]] -> Cell -> [Cell, Cell]
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