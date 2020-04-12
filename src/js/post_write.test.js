const { JSDOM } = require("jsdom");
const dom = new JSDOM();
global.document = dom.window.document;
global.localStorage = {
  setItem: () => null,
};
delete global.window.location;
global.window.location = { href: "" };

const {
  STORAGE_POST_LIST_QUERY_STRING,
  parseStringToHtml,
  renderElements,
} = require("./global");

global.STORAGE_POST_LIST_QUERY_STRING = STORAGE_POST_LIST_QUERY_STRING;
global.parseStringToHtml = parseStringToHtml;
global.renderElements = renderElements;
global.alert = () => "alert";
global.api = {
  setPost: () => Promise.resolve({}),
};

const { createOptionElem, handleFormSubmit } = require("./post_write");

describe("post_write 모듈 함수 테스트", () => {
  test("createOptionElem에 {key, value}를 넣으면 option element 반환", () => {
    const optionElem = createOptionElem({ key: "hi", value: "bye" });

    expect(optionElem.getAttribute("value")).toEqual("hi");
    expect(optionElem.textContent).toEqual("bye");
  });

  describe("handleFormSubmit 테스트", () => {
    const context = {
      title: {
        value: "",
        focus() {
          return "title nopass";
        },
      },
      body: {
        value: "",
        focus() {
          return "body nopass";
        },
      },
      course_id: {
        value: -1,
        focus() {
          return "course_id nopass";
        },
      },
      author: {
        value: "",
        focus() {
          return "author nopass";
        },
      },
    };
    const e = {
      preventDefault: () => null,
      stopPropagation: () => null,
    };

    test("title 유효성 테스트", () => {
      expect(handleFormSubmit.call(context, e)).toEqual("title nopass");
      context.title.value = "제목을 입력했습니다.";
      expect(handleFormSubmit.call(context, e)).not.toEqual("title nopass");
    });

    test("body 유효성 테스트", () => {
      expect(handleFormSubmit.call(context, e)).toEqual("body nopass");
      context.body.value = "본문을 10자 이상 입력했습니다.";
      expect(handleFormSubmit.call(context, e)).not.toEqual("body nopass");
    });

    test("course_id 유효성 테스트", () => {
      expect(handleFormSubmit.call(context, e)).toEqual("course_id nopass");
      context.course_id.value = 1;
      expect(handleFormSubmit.call(context, e)).not.toEqual("course_id nopass");
    });

    test("author 유효성 테스트", () => {
      expect(handleFormSubmit.call(context, e)).toEqual("author nopass");
      context.author.value = "작성자를 입력했습니다";
      expect(handleFormSubmit.call(context, e)).not.toEqual("author nopass");
    });
  });
});
