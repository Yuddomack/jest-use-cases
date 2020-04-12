const { sum, sumOf } = require('./sum');

test('1 + 2 = 3', () => {
    expect(sum(1, 2)).toBe(3);
});


it('5 + 2는 7이다', ()=>{
    expect(sum(5, 2)).toBe(7);
});

describe('sum', () => {
    it('2 + 9', () => {
        expect(sum(2,9)).toBe(11);
    });

    it('test sumOf [1,2,3,4,5,6,7,8,9,10]', () => {
        expect(sumOf([1,2,3,4,5,6,7,8,9,10])).toBe(55);
    })
})