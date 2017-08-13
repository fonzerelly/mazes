const {
    field,
    neighbours,
    size,
    randomCell,
    reduceCells
} = require('./index');

const {
    cell
} = require('../cell');

const {
    Just,
    fromNullable
} = require('data.maybe');

const {
    curry
} = require('core.lambda');

const {
    show
} = require('core.inspect');

describe('field', () => {
    const f = field(3,4)
    it('should create a two dimensional array', () => {
        expect(f.length).toBe(3);
        f.forEach((row) => {
            expect(row.length).toBe(4);
        });
    });
    f.forEach((r, i) => {
        r.forEach((c, j) => {
            it(`should contain a cell with row ${i} and column ${j}`, () => {
                expect(c.row).toBe(i);
                expect(c.column).toBe(j);
            });
        });
    });
    describe('neighbours', () => {
        it('should provide an object with four directions', () => {
            const result = neighbours(f, cell(1,1));
            expect(result.north).toBeDefined();
            expect(result.south).toBeDefined();
            expect(result.west).toBeDefined();
            expect(result.east).toBeDefined();
        });

        it('should provide a Maybe<cell> values for eachDirection', () => {
            const result = neighbours(f, cell(1,1));
            expect(result.north.isJust).toBeDefined();
            expect(result.south.isJust).toBeDefined();
            expect(result.west.isJust).toBeDefined();
            expect(result.east.isJust).toBeDefined();
        });

        describe('when we are looking for neighbours of a cell in the middle', () => {
            let result;
            beforeEach(() => {
                result = neighbours(f, cell(1,1));
            });
            [
                {dir:'north', c: cell(0,1)},
                {dir:'south', c: cell(2,1)},
                {dir:'west', c: cell(1,0)},
                {dir:'east', c: cell(1,2)}
            ].forEach((setup) => {
                it(`should provide Just({value: ${setup.c}}) in ${setup.dir}`, () => {
                    expect(result[setup.dir].get()).toEqual(setup.c);
                });
            });
        });
        describe('when we are looking for neighbours at the borders', () => {
            it('must not throw', () => {
                expect(()=>{
                    neighbours(f, cell(0,0));
                }).not.toThrow();
            });

            it('should provide nothings for all cells outside the field and Just()s otherwise', () => {
                const result = neighbours(f, cell(0,0));
                expect(result.west.isNothing).toBe(true);
                expect(result.north.isNothing).toBe(true);
                expect(result.east.isJust).toBe(true);
                expect(result.south.isJust).toBe(true);
            });
        });
    });
    describe('size', () => {
        it('should calculate the number of cells of a field', () => {
            expect(size(f)).toBe(12);
        });
    });
    describe('randomCell', () => {
        var firstResult;
        beforeEach(() => {
            firstResult = randomCell(f);
        });
        it('should select one the fields cells', () => {
            const maybeResult = fromNullable(f[firstResult.row])
                .chain((row) => {
                    return fromNullable(row[firstResult.column]);
                });
            expect(maybeResult.isJust).toBe(true);
        });
        it('should select another cell at the second call', () => {
            secondResult = randomCell(f);
            const maybeResult = fromNullable(f[firstResult.row])
                .chain((row) => {
                    return fromNullable(row[firstResult.column]);
                });
            expect(maybeResult.isJust).toBe(true);

            expect(secondResult).not.toEqual(firstResult);
        });
    });
    describe('reduceCells', () => {
        it('should iterate a container by each cell', () => {
            let result = reduceCells(f, (init, cell) => {
                expect(init.cell).not.toEqual(cell);
                init.count = init.count + 1;
                init.cell = cell;
                return init;
            }, {cell: null, count:0});
            expect(result.count).toBe(size(f));
        });
    });
});