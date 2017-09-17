const {
    field
} = require('../lib/field')

const {
    binaryTree
} = require('../lib/algorithms/binary-tree')

const {
    render
} = require('../lib/display/ascii')

f = field(parseInt(process.argv[2], 10), parseInt(process.argv[3], 10))
console.log(
    render(f, binaryTree(f))
)