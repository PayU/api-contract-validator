const { get } = require('lodash');

module.exports.parseResponse = (response) => {
  try {
    const { request, config } = response;

    return {
      request: {
        path: request.path || request.req.path,
        method: (request.method || config.method).toLowerCase(),
        headers: request.headers,
        body: request.body || request.form || request.data,
      },
      response: {
        status:
          response.statusCode // request/supertest
          || response.status, // axios
        body:
          response.body // request
          || response.data // axios
          || JSON.parse(get(response, 'res.text', '{}')), // supertest
        headers: response.headers,
      },
    };
  } catch (error) {
    return undefined;
  }
};
