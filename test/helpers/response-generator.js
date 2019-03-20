const nock = require('nock');
const rp = require('request-promise-native');
const axios = require('axios');
const request = require('supertest');

const defaults = {
  path: '/v2/pet/123',
  url: 'http://www.google.com',
  method: 'get',
};

module.exports.request = (options = {}) => {
  mock(options);

  return rp({
    method: options.method || defaults.method,
    baseUrl: defaults.url,
    uri: options.uri || options.path || defaults.path,
    resolveWithFullResponse: true,
    simple: options.simple,
    json: true,
  });
};

module.exports.axios = (options = {}) => {
  mock(options);

  return axios({
    method: options.method || defaults.method,
    baseURL: options.uri || defaults.url,
    url: options.uri || defaults.path,
    json: true,
  });
};

module.exports.supertest = (options = {}) => {
  mock(options);

  const method = options.method || defaults.method;
  const uri = options.uri || options.path || defaults.path;
  return request(defaults.url)[method](uri);
};

module.exports.mock = mock;

function mock({ status, body, headers }) {
  nock.cleanAll();
  nock(/./).get(/./).reply(status, body, headers);
}
