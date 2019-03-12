const should = require('should');
const path = require('path');

const apiSchema = require('../lib/index').shouldPlugin;
const { request } = require('./helpers/response-generator');
const { headersObject, bodyObject } = require('./data/responses');

const schemaPath = path.join(__dirname, 'data', 'schema.json');
const invalidSchemaPath = '/not/a/path';

apiSchema(should.Assertion);

describe('chai plugin test', () => {
  it('Response object matches the schema', async () => {
    const response = await request({
      status: 200,
      body: bodyObject.valid,
      headers: headersObject.valid,
    });

    should(response).be.successful().and.matchApiSchema(schemaPath);
  });
  it('Response object does not match the schema', async () => {
    const response = await request({
      status: 200,
      body: bodyObject.invalid,
      headers: headersObject.valid,
    });

    should(response).not.matchApiSchema(schemaPath);
  });
  it('Response object does not contain method', () => {
    should(expectationTester({ path: '/pet/123', status: 200, schemaPath }))
      .throw('expected request, axios or supertest response object');
  });
  it('Response object does not contain path', () => {
    should(expectationTester({ method: 'get', status: 200, schemaPath }))
      .throw('expected request, axios or supertest response object');
  });
  it('Response object does not contain status', () => {
    should(expectationTester({ method: 'get', path: '/pet/123', schemaPath }))
      .throw('expected request, axios or supertest response object');
  });
  it('Schema path not valid', () => {
    should(expectationTester({
      method: 'get', path: '/pet/123', status: 200, schemaPath: invalidSchemaPath,
    })).throw("ENOENT: no such file or directory, open '/not/a/path'");
  });
  it('Schema file is not contain the request path', () => {
    should(expectationTester({
      method: 'get', path: '/predators/123', status: 200, schemaPath,
    })).throw('schema not found for {"path":"/predators/123","method":"get","status":200}');
  });
  it('Schema file is not contain the request method', () => {
    should(expectationTester({
      method: 'options', path: '/pet/123', status: 200, schemaPath,
    })).throw('schema not found for {"path":"/pet/123","method":"options","status":200}');
  });
  it('Schema file is not contain the response status code', () => {
    should(expectationTester({
      method: 'get', path: '/pet/123', status: 302, schemaPath,
    })).throw('schema not found for {"path":"/pet/123","method":"get","status":302}');
  });
});

function expectationTester({
  path, method, status, schemaPath,
}) {
  return () => should({ request: { method, path }, statusCode: status }).matchApiSchema(schemaPath);
}
