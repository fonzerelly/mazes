const { 
    Cell,
    cell,
    link,
    unlink,
    isLinked,
    linksOf
} = require('./index');

const {
    compose
} = require('core.lambda');

describe('Cell', () => {
    describe('cell', () => {
        it ('should return an object of CellType', () => {    
            const c = cell(0, 1)
            expect(c.row).toBeDefined();
            expect(c.column).toBeDefined();
        });
        
        it ('should store the parameters in its corresponding fields', () => {
            const row = 5;
            const column = 8;
            const c = cell(row, column);

            expect(c.row).toBe(row);
            expect(c.column).toBe(column);
        });
    });

    describe('isLinked', () => {
        const a = cell(1,2);
        const b = cell(2,2);
        const c = cell(2,3);
        describe('when container is empty', () => {
            it('should be false', () => {
                const container = [];
                expect(isLinked(container, a, b)).toBe(false);
            });
        });
        describe('when container contains link', () => {
            const container = [[a,b]];
            it('should return true for a, b', () => {
                expect(isLinked(container, a, b)).toBe(true);
            });
            it('should return true for b, a', () => {
                expect(isLinked(container, b, a)).toBe(true);
            });
        });
        describe('when container does NOT contain link', () => {
            const container = [[a,b]];
            it('should be false', () => {
                expect(isLinked(container, a, c)).toBe(false);
            });
        })
    });

    describe('link', () => {
        let a, b, c;
        beforeEach(() => {
            a = cell(1, 2);
            b = cell(2, 2);
            c = cell(2, 3);
        });

        it('should link two cells to each other', () => {
            const linkContainer = link([], a, b);
            expect(isLinked(linkContainer, a, b)).toBe(true);
        });

        it('should keep unrelated links', () => {
            const linkContainer = link(
                link([],a, b),
                a, c
            );
            expect(isLinked(linkContainer, a, b)).toBe(true);
            expect(isLinked(linkContainer, a, c)).toBe(true);
            expect(isLinked(linkContainer, b, c)).toBe(false);
            expect(linkContainer.length).toBe(2);
        });

        it('should refuse to create the same link a second time', () => {
            const linkContainer = link(
                link([], a, b),
                a, b
            );
            expect(isLinked(linkContainer, a, b)).toBe(true);
            expect(linkContainer.length).toBe(1);
        });
    });
    
    describe('unlink', () => {
        let a, b, c, linkContainer;
        beforeEach(() => {
            a = cell(1, 2);
            b = cell(2, 2);
            c = cell(2, 3);
            linkContainer = link(
                link([],a, b),
                a, c
            );
        });

        it('should remove link', () => {
            var result = unlink(linkContainer, a, b);
            expect(isLinked(result, a, b)).toBe(false);
            expect(result.length).toBe(1);
        });

        it('should remove link not taking care of direction', () => {
            var result = unlink(linkContainer, b, a);
            expect(isLinked(result, a, b)).toBe(false);
            expect(result.length).toBe(1);
        });
    });

    describe('linksOf', () => {
        let a, b, c, linkContainer;
        beforeEach(() => {
            a = cell(1, 2);
            b = cell(2, 2);
            c = cell(2, 3);
            linkContainer = link(
                link([],a, b),
                a, c
            );
        });
        it('should return all linked cells of a cell', () => {
            const result = linksOf(linkContainer, a)
            expect(result).toContain(b);
            expect(result).toContain(c);
        });
    });
});