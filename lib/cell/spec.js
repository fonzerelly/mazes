const {
    cell,
    link,
    linkMaybe,
    unlink,
    unlinkMaybe,
    isLinked,
    isLinkedMaybe,
    linksOf
} = require('./index');

const {
    compose
} = require('core.lambda');

const {
    Just,
    Nothing
} = require('data.maybe');

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

    describe('isLinkedMaybe', () => {
        const a = cell(1,2);
        const b = cell(2,2);
        const c = cell(3,2);

        describe('when container is empty', () => {
            it('should be false', () => {
                const container = [];
                expect(isLinkedMaybe(container, Just(a), Just(b))).toBe(false);
            });
        });

        describe('when container contains maybe a link', () => {
            describe('and it is Just a link', () => {
                const container = [Just([a,b])];
                it('should return true for maybe(a), maybe(b)', () => {
                    expect(isLinkedMaybe(container, Just(a), Just(b))).toBe(true);
                });
                it('should return false for one of the Nothing', () => {
                    expect(isLinkedMaybe(container, Nothing(), Just(b))).toBe(false);
                    expect(isLinkedMaybe(container, Just(a), Nothing())).toBe(false);
                });
            });
            describe('and it is Nothing', () => {
                const container = [Nothing()];
                it('should return false for maybe(a), maybe(b)', () => {
                    expect(isLinkedMaybe(container, Just(a), Just(b))).toBe(false);
                });
            });
        });
        describe('when container does NOT contain link', () => {
            const container = [Just([a,b])];
            it('should be false', () => {
                expect(isLinked(container, Just(a), Just(c))).toBe(false);
            });
        })
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

    describe('linkMaybe', () => {
        let a, b, c;
        beforeEach(() => {
            a = cell(1, 2);
            b = cell(2, 2);
            c = cell(2, 3);
        });

        it('should link two maybeCells to each other', () => {
            const linkContainer = linkMaybe([], Just(a), Just(b));
            expect(isLinkedMaybe(linkContainer, Just(a), Just(b))).toBe(true);
        });

        it('should keep unrelated links', () => {
            const linkContainer = linkMaybe(
                linkMaybe([], Just(a), Just(b)),
                Just(a), Just(c)
            );
            expect(isLinkedMaybe(linkContainer, Just(a), Just(b))).toBe(true);
            expect(isLinkedMaybe(linkContainer, Just(a), Just(c))).toBe(true);
            expect(isLinkedMaybe(linkContainer, Just(b), Just(c))).toBe(false);
            expect(linkContainer.length).toBe(2);
        });

        it('should refuse to create a link for NothingCells', () => {
            const linkContainer = linkMaybe([], Just(a), Just(b));
            expect(linkMaybe(linkContainer, Just(a), Nothing())).toBe(linkContainer);
            expect(linkMaybe(linkContainer, Nothing(), Just(b))).toBe(linkContainer);
        })

        it('should refuse to create a link if link already exists', () => {
            const linkContainer = linkMaybe([], Just(a), Just(b));
            expect(linkMaybe(linkContainer, Just(a), Just(b))).toBe(linkContainer);
            expect(linkMaybe(linkContainer, Just(b), Just(a))).toBe(linkContainer);
        })

    })

    describe('unlinkMaybe', () => {
        let a, b, c, linkContainer;
        beforeEach(() => {
            a = cell(1, 2);
            b = cell(2, 2);
            c = cell(2, 3);
            linkContainer = linkMaybe(
                linkMaybe([],Just(a), Just(b)),
                Just(a), Just(c)
            );
        });

        it('should remove link', () => {
            var result = unlinkMaybe(linkContainer, Just(a), Just(b));
            expect(isLinkedMaybe(result, Just(a), Just(b))).toBe(false);
            expect(result.length).toBe(1);
        });

        it('should remove link not taking care of direction', () => {
            var result = unlinkMaybe(linkContainer, Just(b), Just(a));
            expect(isLinkedMaybe(result, Just(a), Just(b))).toBe(false);
            expect(result.length).toBe(1);
        });
    })
    
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