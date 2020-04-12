const { JSDOM } = require("jsdom");
const dom = new JSDOM();
global.document = dom.window.document;

const { renderElements, parseStringToHtml } = require("./global");
global.renderElements = renderElements;
global.parseStringToHtml = parseStringToHtml;
global.parseQueryString = () => {
  return { id: 1 };
};
global.alert = () => "alert";
global.api = {
  setComment: () => {
    const mock = {
      then: () => mock,
      catch: () => mock,
    };
    return mock;
  },
};

const { createContentElem, handleCommentSubmit } = require("./post_detail");

describe("post_detail 모듈 함수 테스트", () => {
  test("createContentElem {author, body, created_at}을 입력하면 dom element를 반환", () => {
    const contentElems = createContentElem({
      author: "yuddomack",
      body: "이것은 본문의 내용 중에 일부입니다.",
      created_at: new Date(2000, 2, 2, 10, 50, 30),
    }).querySelectorAll("div");

    expect(contentElems[0].textContent).toEqual(
      "[작성자] yuddomack / 2000-3-2 10:50:30 AM"
    );
    expect(contentElems[1].textContent).toEqual(
      "이것은 본문의 내용 중에 일부입니다."
    );
  });

  describe("handleCommentSubmit 테스트", () => {
    const context = {
      author: {
        value: "",
        focus() {
          return "author nopass";
        },
      },
      body: {
        value: "",
        focus() {
          return "body nopass";
        },
      },
    };
    const e = {
      preventDefault: () => null,
      stopPropagation: () => null,
    };

    test("author 유효성 테스트", () => {
      expect(handleCommentSubmit.call(context, e)).toEqual("author nopass");
      context.author.value = "yuddomack";
      expect(handleCommentSubmit.call(context, e)).not.toEqual("author nopass");
    });

    test("body 유효성 테스트", () => {
      expect(handleCommentSubmit.call(context, e)).toEqual("body nopass");
      context.body.value = "이것은 본문의 일부입니다";
      expect(handleCommentSubmit.call(context, e)).not.toEqual("body nopass");
    });
  });
});
