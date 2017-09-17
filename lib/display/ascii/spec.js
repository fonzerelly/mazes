const {
    field
} = require('../../field')

const {
    cell,
    link
} = require('../../cell')

const ascii = require('./index')

describe('display/ascii/preperation', () => {
    let linkContainer

    describe('cellToString', () => {
        describe('when cell has no link to south or east', () => {
            let a, b;
            beforeEach(() => {
                a = cell(0, 0);
                b = cell(0, 1);
                c = cell(0, 2);
                d = cell(1, 1);
                e = cell(2, 1);
                linkContainer = link([], a, b);
                linkContainer = link(linkContainer, b, c);
                linkContainer = link(linkContainer, d, b);
                linkContainer = link(linkContainer, e, d);
            })
            it('should look closed', () => {
                expect(ascii.cellToStringArray(linkContainer, c)).toEqual([
                    ' |',
                    '-+'
                ]);
            });
            it('should look open to the right', () => {
                expect(ascii.cellToStringArray(linkContainer, a)).toEqual([
                    '  ',
                    '-+'
                ]);
            });

            it('should look open to the bottom', () => {
                expect(ascii.cellToStringArray(linkContainer, d)).toEqual([
                    ' |',
                    ' +'
                ]);
            });

            it('should look open to the right and the bottom', () => {
                expect(ascii.cellToStringArray(linkContainer, b)).toEqual([
                    '  ',
                    ' +'
                ]);
            });
        });
    });

    describe('accumulateStringCells', () => {
        it('should append each fist row to first init, second row to second init', () => {
            const init = [
                '    ',
                '-+-+'
            ];
            const cellStringArray = [
                ' |',
                ' +'
            ];

            expect(ascii.accumulateStringCells(init, cellStringArray)).toEqual([
                '     |',
                '-+-+ +'
            ]);
        });
    });

    describe('triggerNewline', () => {
        it('should first finish the previous line by "+"', () => {
            expect(ascii.triggerNewLine(['','']).split('\n')[1]).toEqual('+');
        })
        
        describe('when it is not the last line', () => {
            it('should first finish the first line by "|"', () => {
                expect(ascii.triggerNewLine(['','']).split('\n')[2]).toEqual('|');
            })
        })
      
        describe('when it is the last line', () => {
            it('should not try to finish first line', () => {
                expect(ascii.triggerNewLine(['',''], true).split('\n')[2]).toBeUndefined();
            })
        })

        it('should render lines with "\n|"', () => {
            expect(ascii.triggerNewLine([
                ' |  ',
                ' +-+'
            ])).toEqual(' |  \n+ +-+\n|');
        });
    });
    describe('render', () => {
        it('should triggerNewLine when several rows are used', () => {
            spyOn(ascii, 'triggerNewLine');
            const f = field(2,2);
            const linkContainer = [];
            ascii.render(f, linkContainer);
            expect(ascii.triggerNewLine).toHaveBeenCalled();
        });
        it('should render top line', () => {
            expect(ascii.render(field(1,2), []).split('\n')[0])
                .toEqual('+-+-+');
        });
        describe('when field has only one line', () => {
            it('should render cells walls', () => {
                expect(ascii.render(field(1,2), []).split('\n')[1])
                    .toEqual('| | |');
            });
            it('should render cells bottoms', () => {
                expect(ascii.render(field(1,2), []).split('\n')[2])
                    .toEqual('+-+-+');
            });
            it('should not try to manipulate next line', () => {
                expect(ascii.render(field(1,2), []).split('\n')[3])
                    .toBeUndefined();
            });
        });
        describe('when field has two lines', () => {
            it('should render cells walls', () => {
                expect(ascii.render(field(2,2), []).split('\n')[3])
                    .toEqual('| | |');
            });
            it('should render cells bottoms', () => {
                expect(ascii.render(field(2,2), []).split('\n')[4])
                    .toEqual('+-+-+');
            });
            it('should not try to manipulate next line', () => {
                expect(ascii.render(field(2,2), []).split('\n')[5])
                    .toBeUndefined();
            });
        });

        describe('when linkContainer is filled LinkContainer', () => {
            it('sould take care of linkContainer as well', () => {
                const f = field(3,3);
                let linkContainer = [];
                linkContainer = link(linkContainer, f[0][0], f[0][1]);
                linkContainer = link(linkContainer, f[0][1], f[0][2]);
                linkContainer = link(linkContainer, f[0][0], f[1][0]);
                linkContainer = link(linkContainer, f[0][2], f[1][2]);
                linkContainer = link(linkContainer, f[1][0], f[2][0]);
                linkContainer = link(linkContainer, f[1][1], f[1][2]);
                linkContainer = link(linkContainer, f[1][2], f[2][2]);
                linkContainer = link(linkContainer, f[2][1], f[2][2]);

                expect(ascii.render(f, linkContainer)).toEqual([
                    '+-+-+-+',
                    '|     |',
                    '+ +-+ +',
                    '| |   |',
                    '+ +-+ +',
                    '| |   |',
                    '+-+-+-+'
                ].join('\n'));
            })           
        })
    });
});