// toBe ===
// toEqual ==

const stats = require('./stats');

describe('stats', () => {
    describe('stats.max', () => {
        it('stats.max case1 - [1,2,3,4]', () => {
            expect(
                stats.max([1,2,3,4])
            ).toBe(4);
        });
    
        it('stats.max case2 - []', () => {
            expect(
                stats.max([])
            ).toBe(NaN); // 무슨 비교 연산을 사용하는거지? NaN을 구분하는군
        });
    });
    
    describe('stats.min', () => {
        it('stats.min case1 - [1,2,3,4]', () => {
            expect(
                stats.min([1,2,3,4])
            ).toBe(1);
        });
    });

    describe('stats.avg', () => {
        it('stats.avg case1 - [3,6,9]', () => {
            expect(
                stats.avg([3,6,9])
            ).toBe(6);
        });
    })

    describe('stats.fetch', () => {
        it('stats.getLocation case1 - 14', async () => {
            expect(
                await stats.getLocation(14)
            ).toEqual([
                {
                    "id": 169,
                    "created_date": "2019-06-20T10:38:34.035251+09:00",
                    "updated_date": "2019-06-20T10:38:34.035299+09:00",
                    "ip": "61.253.199.226",
                    "lat": 35.815517,
                    "lon": 127.103324,
                    "address": "대한민국 전라북도 전주시 완산구 효자4동 홍산남로 14",
                    "user": 14
                }
            ]);
        });
    });
})