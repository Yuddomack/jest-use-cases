const { JSDOM } = require("jsdom");
const dom = new JSDOM();
global.document = dom.window.document;

const {
  createQueryString,
  parseQueryString,
  parseStringToHtml,
  Observer,
  ObservableStore,
  renderElements,
} = require("./global");
const createOptionElem = () => document.createElement("option");

describe("global module test", () => {
  describe("createQueryString에 객체를 넣으면 쿼리스트링을 반환한다", () => {
    test("객체가 아닌것들을 넣었을 때", () => {
      const num = 1;
      const str = "1asdf";
      const bool = true;
      const arr = [2, 3, 4];
      const func = function () {};

      expect(createQueryString(num)).toEqual("");
      expect(createQueryString(str)).toEqual("");
      expect(createQueryString(bool)).toEqual("");
      expect(createQueryString(arr)).toEqual("");
      expect(createQueryString(func)).toEqual("");
    });
    test("객체를 넣었을 때", () => {
      expect(createQueryString({})).toEqual("");
      expect(createQueryString({ a: 1 })).toEqual("?a=1&");
      expect(createQueryString({ id: "hello", pwd: "secret" })).toEqual(
        "?id=hello&pwd=secret&"
      );
    });
  });

  describe("parseQueryString에 쿼리스트링을 넣으면 객체를 반환한다", () => {
    test("쿼리 스트링을 넣었을 때", () => {
      expect(parseQueryString("asdf.com?id=hello&pwd=secret&")).toEqual({
        id: "hello",
        pwd: "secret",
      });
    });
  });

  describe("parseStringToHtml에 string을 넣으면 html 형식으로 파싱해준다(XSS injection을 방지하자)", () => {
    test("String에 <가 있을때", () => {
      expect(parseStringToHtml("<asdf")).toEqual("&lt;asdf");
    });
    test("String에 >가 있을때", () => {
      expect(parseStringToHtml("asdf>")).toEqual("asdf&gt;");
    });
    test("String에 엔터(\n)가 있을때", () => {
      // HACK: prettier로 인해 공백 생기는 걸 제거해야함
      expect(
        parseStringToHtml(
          `asdf
          qwer`.replace(/\ /g, "")
        )
      ).toEqual("asdf<br />qwer");
    });
    test("통합", () => {
      expect(
        parseStringToHtml(
          `<script>
          alert("hi");
        </script>`.replace(/\ /g, "")
        )
      ).toEqual('&lt;script&gt;<br />alert("hi");<br />&lt;/script&gt;');
    });
  });

  describe("Observer 패턴 테스트", () => {
    let sideEffect = false;
    const observer = Observer();

    test("subscribe 등록 테스트", () => {
      expect(observer.handlers).toEqual({});

      observer.sub("hi", () => {
        sideEffect = true;
      });

      expect(observer.handlers["hi"]).toBeInstanceOf(Array);
    });
    test("publish 테스트", () => {
      observer.pub("hi");
      expect(sideEffect).toBe(true);
    });
  });

  describe("Observer 패턴 테스트", () => {
    let store = null;
    let sideEffect = false;

    test("store 초기화 테스트", () => {
      store = ObservableStore({ name: "yuddomack" });
      expect(store.state).toEqual({ name: "yuddomack" });
    });
    test("setState 테스트", () => {
      store.setState({ name: "bro" });
      expect(store.state).toEqual({ name: "bro" });
    });
    test("setState 구독 테스트", () => {
      store.sub(() => {
        sideEffect = true;
      });
      store.setState({ name: "something" });
      expect(sideEffect).toEqual(true);
    });
  });

  test("renderElements에 target element와 dom 배열을 넣으면 append 된다", () => {
    const target = document.createElement("div");
    const optionElems = [
      { key: "1", value: "선택1" },
      { key: "2", value: "선택2" },
      { key: "3", value: "선택3" },
    ].map(createOptionElem);

    renderElements(target, optionElems);
    expect(target.querySelectorAll("option").length).toBe(3);
  });
});
