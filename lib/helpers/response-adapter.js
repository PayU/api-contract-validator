const { get } = require('lodash');

module.exports.parseResponse = (response) => {
  try {
    const { request, config } = response;

    return {
      request: {
        method: getRequestMethod(config || request || response),
        path: getRequestPath(request || response),
      },
      response: {
        status: getResponseCode(response),
        headers: getResponseHeaders(response),
        body: getResponseBody(response),
      },
    };
  } catch (error) {
    return undefined;
  }
};

function getRequestMethod(request) {
  const { method } = request;

  return method && method.toLowerCase();
}

function getRequestPath(request) {
  // request promise
  if (request.uri) {
    return cleanPath(request.uri.pathname);
  }

  // axios
  if (request.path) {
    return cleanPath(request.path);
  }

  // supertest
  if (get(request, 'req.path')) {
    return cleanPath(request.req.path);
  }

  return undefined;
}

function getResponseHeaders(response) {
  return response.headers;
}

function getResponseCode(response) {
  // request-promise
  if (response.statusCode) {
    return response.statusCode;
  }

  // other
  return response.status;
}

function getResponseBody(response) {
  // request-promise/other
  if (response.body) {
    return response.body;
  }

  // axios
  if (response.data) {
    return response.data;
  }

  return undefined;
}

function cleanPath(path) {
  return path.split('?')[0].replace(/\/*$/, '');
}
