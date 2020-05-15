const get = require('lodash.get');
const urijs = require('uri-js');

function parseResponse(response) {
  if (isFastifyResponse(response)) {
    return parseFastifyResponse(response);
  }

  return parseGenericResponse(response);
}

function parseFastifyResponse(response) {
  try {
    const { res, req } = response.raw;

    return {
      request: {
        method: getRequestMethod(req || res),
        path: resolveUrlDataFastify(req.headers, req).path,
      },
      response: {
        status: response.statusCode,
        headers: response.headers,
        body: response.json(),
      },
    };
  } catch (error) {
    return undefined;
  }
}

function parseGenericResponse(response) {
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
}

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
  return path
    .split('?')[0] // clean query params
    .replace(/\/*$/, ''); // clean trailing slashes
}

function isFastifyResponse(response) {
  const userAgent = response && response.raw && response.raw.req && response.raw.req.headers['user-agent'];
  if (userAgent) {
    return userAgent.toLowerCase() === 'lightmyrequest';
  }

  return false;
}

function resolveUrlDataFastify(headers, req) {
  const scheme = `${headers[':scheme'] ? `${headers[':scheme']}:` : ''}//`;
  const host = headers[':authority'] || headers.host;
  const path = headers[':path'] || req.url;
  return urijs.parse(scheme + host + path);
}

module.exports = {
  parseResponse,
};
