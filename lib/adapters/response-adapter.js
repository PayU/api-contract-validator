const { get } = require('lodash');

module.exports.parseResponse = (response) => {
  const { request, config } = response;

  return {
    request: {
      path: request.path || request.req.path,
      method: (request.method || config.method).toLowerCase(),
      // qs: request.qs instanceof Function ? request.qs() : request.qs,
      // query: request.query,
      headers: request.headers,
      body: request.body || request.form || request.data,
    },
    response: {
      statusCode:
        response.statusCode // request/supertest
        || response.status, // axios
      body:
        response.body // request
        || response.data // axios
        || JSON.parse(get(response, 'res.text', '{}')), // supertest
      headers: response.headers,
    },
  };
};
