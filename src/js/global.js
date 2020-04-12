const STORAGE_POST_LIST_QUERY_STRING = "STORAGE_POST_LIST_QUERY_STRING";

function createQueryString(obj) {
  if (Object.prototype.toString.call(obj) !== "[object Object]") {
    return "";
  }
  if (Object.keys(obj).length < 1) {
    return "";
  }

  let queryString = "?";

  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      queryString += `${key}=${value}&`;
    }
  }

  return queryString;
}

function parseQueryString(url) {
  const [, query] = url.split("?");
  if (!query) {
    return null;
  }

  const obj = {};

  for (const param of query.split("&")) {
    const [key, value] = param.split("=");
    obj[key] = value;
  }

  return obj;
}

function parseStringToHtml(str) {
  return str
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br />");
}

function Observer() {
  return {
    handlers: {},
    sub: function (eventName, handler, context) {
      if (!this.handlers[eventName]) {
        this.handlers[eventName] = [];
      }
      this.handlers[eventName].push({
        handler: handler,
        context: context,
      });
    },
    pub: function (eventName, data) {
      if (!this.handlers[eventName]) {
        return false;
      }
      var subs = this.handlers[eventName];
      var i = subs.length;
      while (i--) {
        subs[i].handler.call(subs[i].context, data);
      }
    },
  };
}

function ObservableStore(initState) {
  var observer = Observer();

  return {
    state: initState,
    setState: function (nextState) {
      this.state = nextState;

      observer.pub("setState", nextState);
    },
    sub: function (handler, context) {
      observer.sub("setState", handler, context);
    },
  };
}

function renderElements(target, elements, clear) {
  if (clear) {
    target.innerHTML = "";
  }
  const fragment = document.createDocumentFragment();
  elements.forEach((e) => fragment.appendChild(e));

  target.appendChild(fragment);
}

if (!!module) {
  module.exports = {
    STORAGE_POST_LIST_QUERY_STRING,
    createQueryString,
    parseQueryString,
    parseStringToHtml,
    Observer,
    ObservableStore,
    renderElements,
  };
}
