const { pick: only } = require('../helpers/obj-utils');

module.exports = (response) => {
  const { request } = response;
  //   console.info(Object.keys(response));
  return {
    request: only(request, [
      'path',
      'headers',
      'params',
      'query',
      'files',
      'method',
      'body',
    ]),
    response: only(response, [
      'statusCode',
      'headers',
      'body',
    ]),
  };
};
