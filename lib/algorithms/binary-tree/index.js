const {
    reduceCells,
    neighbours    
} = require('../../field');

const {
    link
} = require('../../cell');

const relevantDirections = [
    ['north', 'east'],
    ['east', 'north']
];


module.exports = {
    binaryTree: (field) => {
        return reduceCells(field, (linksContainer, cell) => {
            const randomDirs = relevantDirections[Math.floor(Math.random()*2)];
            const directions = neighbours(field, cell);
            const maybeCellToLinkTo = directions[randomDirs[0]];
            const maybeOtherPotentialCell = directions[randomDirs[1]];
            const c =  maybeCellToLinkTo.getOrElse(
                maybeOtherPotentialCell.getOrElse(undefined)
            );
            if (!c) {
                return linksContainer
            }
            return link(linksContainer, cell, c)
        },[]);
    }
}