const pick = require('lodash.pick');

module.exports = (response) => {
  const { request } = response;

  return {
    request: pick(request, [
      'path',
      'headers',
      'params',
      'query',
      'files',
      'method',
      'body',
    ]),
    response: pick(response, [
      'statusCode',
      'headers',
      'body',
    ]),
  };
};
