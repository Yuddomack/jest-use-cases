/* global api, ObservableStore, renderElements, STORAGE_POST_LIST_QUERY_STRING */
// TODO 정렬

let courses = null;
const pageSize = 10;

const queryStore = ObservableStore();

// NOTE: 해당 element는 request -> render시 지속적으로 참조해야하므로 클로저로 사용
const postListComponent = document.querySelector(".PostList");
const navGroupComponent = document.querySelector(".Nav__group");

window.onload = async function () {
  courses = await api.getCourses();

  const filterElem = document.querySelector(".Header__filter__select");
  const searchFormElem = document.querySelector(".Header__searchForm");
  const navElem = document.querySelector(".Nav");

  filterElem.addEventListener("change", handleFilterChange);
  searchFormElem.addEventListener("submit", handleSearchSubmit);
  navElem.addEventListener("click", handleNavClick);

  // NOTE: 상태 변화를 구독할 수 있는 store 객체
  queryStore.sub(querySubscriber);

  const defaultQueryStore = JSON.parse(
    localStorage.getItem(STORAGE_POST_LIST_QUERY_STRING)
  ) || { page: 1 };
  queryStore.setState(defaultQueryStore);
};

// 모듈 함수들
function querySubscriber(nextQuery) {
  // NOTE: 뒤로가기 시, 정보를 기억할 수 있도록하자
  localStorage.setItem(
    STORAGE_POST_LIST_QUERY_STRING,
    JSON.stringify(nextQuery)
  );
  requestAndRenderPosts(nextQuery);
}

async function requestAndRenderPosts(params) {
  // NOTE: 서버 로직 버그 - 검색, 필터 적용한 데이터가 n개 임에도 count 값은 전체 개수와 같음
  const { posts, count } = await api.getPosts(params);
  posts.sort((a, b) => a.created_at.localeCompare(b.created_at));

  const pageCountRange = getPageCountRange(params.page, count, pageSize);
  const pageButtonElems = pageCountRange.map((c) =>
    createPageButtonElem(c, params.page)
  );
  checkStepNavButton(
    params.page,
    pageCountRange[0],
    pageCountRange[pageCountRange.length - 1]
  );
  renderElements(navGroupComponent, pageButtonElems, true);

  const postElems = posts.map(createPostElem);
  renderElements(postListComponent, postElems, true);
}

function getPageCountRange(pageNumber = 1, totalCount, pageSize) {
  const minPage = 1;
  if (totalCount <= 0) {
    return [minPage];
  }
  const maxPage = Math.ceil(totalCount / pageSize);

  if (maxPage <= 5) {
    return [...Array(maxPage).keys()].map((v) => ++v);
  }

  const expectedLastPage = Math.max(pageNumber + 2, 5);

  // NOTE: 마지막 페이지 number는 maxPage를 넘어선 안됨
  const lastPage = Math.min(expectedLastPage, maxPage);

  // NOTE: 마지막 페이지 number를 초과한 만큼 시작 number를 더 보여줘야함 -> overFromLastPage는 < 0의 수
  const overFromLastPage = Math.min(maxPage - expectedLastPage, 0);

  // NOTE: 그러나 시작 number는 minPage를 넘어선 안됨
  const startPage = Math.max(pageNumber - 2 + overFromLastPage, minPage);

  const range = [];
  for (let i = startPage; i <= lastPage; i++) {
    range.push(i);
  }

  return range;
}

function checkStepNavButton(pageNumber = 1, startPage, lastPage) {
  // HACK: 이전, 다음 disable를 어디에 배치하는게 좋을것인가..
  const prevButton = document.querySelector(".Nav__button.left");
  const nextButton = document.querySelector(".Nav__button.right");

  prevButton.disabled = false;
  nextButton.disabled = false;

  if (pageNumber === startPage) {
    prevButton.disabled = true;
  }
  if (pageNumber === lastPage) {
    nextButton.disabled = true;
  }
}

function createPostElem(post) {
  const { id, author, title, body, course_id, is_resolved, created_at } = post;

  const postElem = document.createElement("article");
  postElem.setAttribute("id", id);
  postElem.setAttribute("class", "Post");

  postElem.innerHTML = `
    <div class="Post__info">
      <div><a href="post_detail.html?id=${id}" class="Post__title">${title}</a></div>
      <div class="Post__detail">${new Date(created_at).toLocaleString()}</div>
      <div class="Post__detail">[작성자] ${author} / ${courses[course_id]}</div>
      <div class="Post__body">${body}</div>
    </div>
    <div class="Post__resolved ${
      is_resolved ? "Post__resolved--success" : ""
    }">${is_resolved ? "해결됨" : "답변대기중"}</div>
  `;

  return postElem;
}

function createPageButtonElem(range, pageNumber = 1) {
  const buttonElem = document.createElement("button");
  let className = "Nav__button";

  if (range === pageNumber) {
    className += " Nav__button--selected";
  }

  buttonElem.setAttribute("class", className);
  buttonElem.textContent = range;

  return buttonElem;
}

// 스토어가 변경됏는지만 확인하면 됨
function handleFilterChange(e) {
  e.preventDefault();
  e.stopPropagation();

  const nextQuery = { ...queryStore.state };
  const selected = this.value;
  switch (selected) {
    case "0":
      delete nextQuery.is_resolved;
      break;
    case "1":
      nextQuery.is_resolved = true;
      break;
    case "2":
      nextQuery.is_resolved = false;
      break;
  }
  queryStore.setState(nextQuery);
}

// 스토어가 변경됐는지만 확인하면 됨
function handleSearchSubmit(e) {
  e.preventDefault();
  e.stopPropagation();

  const nextQuery = { ...queryStore.state };
  const search = this.search.value;

  if (search === "") {
    delete nextQuery.s;
  } else {
    nextQuery.s = search;
  }

  queryStore.setState(nextQuery);
}

function handleNavClick(e) {
  e.preventDefault();
  e.stopPropagation();

  const nextQuery = { ...queryStore.state };
  const navButtonText = e.target.textContent;
  let nextPage = nextQuery.page;

  if (navButtonText === "이전") {
    nextPage--;
  } else if (navButtonText === "다음") {
    nextPage++;
  } else {
    nextPage = Number(navButtonText);
  }

  nextQuery.page = nextPage;
  queryStore.setState(nextQuery);
}

if (!!module) {
  module.exports = {
    getPageCountRange,
  };
}
