/* global createQueryString */

const URL = 'http://localhost:7070/api';
const COURSES_ROUTE = 'courses';
const POSTS_ROUTE = 'posts';
const COMMENTS_ROUTE = 'comments';
const IS_RESOLVED_ROUTE = 'is_resolved';

const api = (function () {
  const f = {
    mock: {},
  };

  f.getCourses = async function getCourses() {
    const courses = {};
    const res = await fetch(`${URL}/${COURSES_ROUTE}`);
    const resJson = await res.json();

    resJson.courses.map(({ id, title }) => {
      courses[id] = title;
    });

    return courses;
  };

  f.getPosts = async function getPosts(params) {
    // page: 페이지 번호, s: 검색어, is_resolved: 필터

    const queryString = createQueryString(params);
    const res = await fetch(`${URL}/${POSTS_ROUTE}${queryString}`);
    const resJson = await res.json();

    return resJson;
  };

  f.getPost = async function getPost(id) {
    const res = await fetch(`${URL}/${POSTS_ROUTE}/${id}`);
    const resJson = await res.json();

    return resJson;
  };

  f.getPost = async function getPost(id) {
    const res = await fetch(`${URL}/${POSTS_ROUTE}/${id}`);
    const resJson = await res.json();

    return resJson;
  };

  f.setPost = async function setPost(body) {
    const res = await fetch(`${URL}/${POSTS_ROUTE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const resJson = await res.json();

    return resJson;
  };

  f.setComment = async function setComment(body) {
    const res = await fetch(`${URL}/${COMMENTS_ROUTE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const resJson = await res.json();

    return resJson;
  };

  f.setResolved = async function setResolved(id, body) {
    const res = await fetch(
      `${URL}/${POSTS_ROUTE}/${id}/${IS_RESOLVED_ROUTE}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    );
    const resJson = await res.json();

    return resJson;
  };

  return f;
})();
