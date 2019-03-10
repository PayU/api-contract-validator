const nock = require('nock');
const rp = require('request-promise-native');
const axios = require('axios');
const request = require('supertest');

const defaults = {
  path: '/pet/123',
  url: 'http://www.google.com',
  method: 'get',
};

module.exports.axios = (code, options = {}) => {
  mock(code, options);

  return axios({
    method: options.method || defaults.method,
    baseURL: defaults.url,
    url: options.uri || defaults.path,
    resolveWithFullResponse: true,
    json: options.body instanceof Object,
    qs: options.qs,
    simple: false,
  });
};

module.exports.request = (code, options = {}) => {
  mock(code, options);

  return rp({
    method: options.method || defaults.method,
    baseUrl: defaults.url,
    uri: options.uri || options.path || defaults.path,
    resolveWithFullResponse: true,
    json: options.body instanceof Object,
    qs: options.qs,
    simple: false,
  });
};

module.exports.supertest = (code, options = {}) => {
  mock(code, options);

  const method = options.method || defaults.method;
  const uri = options.uri || options.path || defaults.path;
  return request(defaults.url)[method](uri);
};

function mock(code, { body, headers }) {
  nock.cleanAll();
  nock(/./).get(/./).reply(code, body, headers);
}
