const { ObservableStore } = require("./global");
global.ObservableStore = ObservableStore;

const { getPageCountRange } = require("./post_list");

describe("post_detail 모듈 함수 테스트", () => {
  test("getPageCountRange은 현재페이지 번호, 총 게시물 수, 페이지당 게시물 수를 주입받아 pagenation할 array를 반환", () => {
    const PAGE_SIZE = 10;
    const case1 = getPageCountRange(1, 0, PAGE_SIZE);
    expect(case1).toEqual([1]);
    const case2 = getPageCountRange(1, 11, PAGE_SIZE);
    expect(case2).toEqual([1, 2]);
    const case3 = getPageCountRange(1, 51, PAGE_SIZE);
    expect(case3).toEqual([1, 2, 3, 4, 5]);
    const case4 = getPageCountRange(4, 51, PAGE_SIZE);
    expect(case4).toEqual([2, 3, 4, 5, 6]);
    const case5 = getPageCountRange(20, 601, PAGE_SIZE);
    expect(case5).toEqual([18, 19, 20, 21, 22]);
  });
});
