/* global api, parseQueryString, parseStringToHtml */
// TODO 정렬

let courses = null;
const query = parseQueryString(location.href);
const contentParentElem = document.querySelector(".Content");
const RESOLVED_LABEL = "해결됨";
const UNRESOLVED_LABEL = "미해결질문";

window.onload = async function () {
  courses = await api.getCourses();

  if (query === null) {
    alert("잘못된 접근입니다");
  }

  const commentFormElem = document.querySelector(".CommentForm");
  const resolveToggleButtonElem = document.querySelector(
    ".Header__resolveButton"
  );

  commentFormElem.addEventListener("submit", handleCommentSubmit);
  resolveToggleButtonElem.addEventListener("click", handleResolveClick);

  requestAndRenderPost(query.id);
};

async function requestAndRenderPost(id) {
  const { post } = await api.getPost(id);
  const {
    _: { comments },
    title,
    course_id,
    is_resolved,
  } = post;

  comments.sort((a, b) => a.created_at.localeCompare(b.created_at));

  const titleElem = document.querySelector(".Header__title");
  const courseElem = document.querySelector(".Header__detail");
  const resolveButtonElem = document.querySelector(".Header__resolveButton");

  const contentElem = createContentElem(post);
  const commentContentElems = comments.map(createContentElem);

  titleElem.textContent = title;
  courseElem.textContent = `[코스] ${courses[course_id]}`;
  resolveButtonElem.textContent = is_resolved
    ? RESOLVED_LABEL
    : UNRESOLVED_LABEL;
  resolveButtonElem.className = `Header__resolveButton ${
    is_resolved ? "Header__resolveButton--success" : ""
  }`;

  renderElements(contentParentElem, [contentElem, ...commentContentElems]);
}

function createContentElem(content) {
  const { author, body, created_at } = content;

  const article = document.createElement("article");
  article.setAttribute("class", "Content__article");

  article.innerHTML = `
    <div class="Content__detail">[작성자] ${author} / ${new Date(
    created_at
  ).toLocaleString()}</div>
    <div class="Content__body">${body}</div>
  `;

  return article;
}

function handleCommentSubmit(e) {
  e.preventDefault();
  e.stopPropagation();

  const { id: post_id } = query;
  const author = this.author.value;
  const body = parseStringToHtml(this.body.value);

  if (!post_id) {
    return alert("잘못된 접근입니다");
  }
  if (!author) {
    alert("작성자를 등록하세요");
    return this.author.focus();
  }
  if (!body) {
    alert("글을 입력하세요");
    return this.body.focus();
  }

  return api
    .setComment({ post_id, author, body })
    .then(({ comment: { created_at } }) => {
      const contentElem = createContentElem({ author, body, created_at });

      renderElements(contentParentElem, [contentElem]);
      this.author.value = "";
      this.body.value = "";
    })
    .catch((e) => {
      console.log(e);
      alert("댓글 등록에 실패했습니다.");
    });
}

function handleResolveClick(e) {
  e.preventDefault();
  e.stopPropagation();

  const before_is_resolved = this.textContent === RESOLVED_LABEL;
  return api
    .setResolved(query.id, { is_resolved: !before_is_resolved })
    .then(({ post: { is_resolved } }) => {
      this.className = `Header__resolveButton ${
        is_resolved ? "Header__resolveButton--success" : ""
      }`;
      this.textContent = is_resolved ? RESOLVED_LABEL : UNRESOLVED_LABEL;
    })
    .catch((e) => {
      console.log(e);
      alert("해결 상태 변경에 실패했습니다.");
    });
}

if (!!module) {
  module.exports = {
    createContentElem,
    handleCommentSubmit,
  };
}
