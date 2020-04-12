/* global api, parseStringToHtml, STORAGE_POST_LIST_QUERY_STRING */
// TODO 정렬

let courses = null;

window.onload = async function () {
  courses = await api.getCourses();

  const writeFormElem = document.querySelector(".Form");

  writeFormElem.addEventListener("submit", handleFormSubmit);

  const courseSelectElem = document.querySelector(".Form__course__select");
  const courseElems = Object.entries(courses).map(([key, value]) =>
    createOptionElem({ key, value })
  );

  renderElements(courseSelectElem, courseElems);
};

function createOptionElem({ key, value }) {
  const option = document.createElement("option");
  option.setAttribute("value", key);
  option.textContent = value;

  return option;
}

function handleFormSubmit(e) {
  e.preventDefault();
  e.stopPropagation();

  const title = this.title.value;
  const body = parseStringToHtml(this.body.value);
  const course_id = Number(this.course_id.value);
  const author = this.author.value;

  if (!title) {
    alert("제목을 입력하세요");
    return this.title.focus();
  }
  if (body.length < 10) {
    alert("본문을 10자 이상 입력하세요");
    return this.body.focus();
  }
  if (course_id === -1) {
    alert("올바른 강의 목록을 선택하세요");
    return this.course_id.focus();
  }
  if (author.length < 3) {
    alert("작성자 이름을 3자 이상 입력하세요");
    return this.author.focus();
  }
  console.log(location.href);

  return api
    .setPost({ title, body, course_id, author })
    .then(({ comment }) => {
      localStorage.setItem(
        STORAGE_POST_LIST_QUERY_STRING,
        JSON.stringify({ page: 1 })
      );
      location.href = "post_list.html";
    })
    .catch((e) => {
      console.log(e);
      alert("등록을 실패했습니다");
    });
}

if (!!module) {
  module.exports = {
    createOptionElem,
    handleFormSubmit,
  };
}
