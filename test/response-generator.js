const rp = require('request-promise-native');
const nock = require('nock');

module.exports = async (code = 200, { body, headers } = {}) => {
  nock.cleanAll();
  nock(/./).get('/').reply(code, body, headers);
  return rp.get('http://www.google.com', {
    resolveWithFullResponse: true,
    json: body instanceof Object,
    simple: false,
  });
};
