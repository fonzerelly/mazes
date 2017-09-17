const {
    linksOf
} = require('../../cell')

const {
    reduceCells
} = require('../../field')

const {
    curry
} = require('core.lambda')

const {
    unary
} = require('core.arity')

const createLinkPredicate = curry (3, function(dimension, cell, otherClell)  {
    return otherClell[dimension] > cell[dimension] || otherClell[dimension] > cell[dimension]
})

const eastLinkPredicate = createLinkPredicate('column')
const southLinkPredicate = createLinkPredicate('row')

const createHasLink = (predicate) => (linkContainer, cell) =>
    linksOf(linkContainer, cell)
        .filter(unary(predicate(cell)))
        .length > 0;

const hasEastLink = createHasLink(eastLinkPredicate);
const hasSouthLink = createHasLink(southLinkPredicate);


module.exports = {
    cellToStringArray: (linkContainer, cell) => {
        return [
            ` ${(hasEastLink(linkContainer, cell))?' ':'|'}`,
            `${(hasSouthLink(linkContainer, cell))?' ':'-'}+`
        ];
    },
    accumulateStringCells: (init, cellString) => {
        return [
            init[0] + cellString[0],
            init[1] + cellString[1]
        ]
    },
    triggerNewLine: (init, lastLine) => {
        const previousLineFinish = '+';
        const firstLineFinish = '|'
        let result = init[0] + '\n' + previousLineFinish + init[1];
        if (!lastLine) {
            result += '\n' + firstLineFinish;
        }
        return result;
    },
    render: (field, linkContainer) => {
        const topLine = '+'+ Array(field[0].length).fill('-').join('+')+'+\n|'
        const iterResult = {
            rowLines: ['', ''],
            lastRow: 0,
            finalResult: topLine
        };

        const finalIter = reduceCells(field, (iter, cell) => {
            if (cell.row !== iter.lastRow) {
                iter.finalResult += module.exports.triggerNewLine(iter.rowLines, false)
                iter.rowLines = ['', '']
            }
            iter.lastRow = cell.row;
            iter.rowLines = module.exports.accumulateStringCells(
                iter.rowLines,
                module.exports.cellToStringArray(linkContainer, cell)
            );
            return iter;
        }, iterResult);
        finalIter.finalResult += module.exports.triggerNewLine(finalIter.rowLines, true)
        return finalIter.finalResult;
    }
}