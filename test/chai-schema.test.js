const { expect, use } = require('chai');
const path = require('path');

const apiSchema = require('../lib/index').chaiPlugin;
const { request } = require('./helpers/response-generator');
const { headersObject, bodyObject } = require('./data/responses');

const schemaPath = path.join(__dirname, 'data', 'schema.json');
const invalidSchemaPath = '/not/a/path';

use(apiSchema);

describe('chai plugin test', () => {
  it('Response object matches the schema', async () => {
    const response = await request({
      status: 200,
      body: bodyObject.valid,
      headers: headersObject.valid,
    });

    expect(response).to.be.successful().and.to.matchApiSchema(schemaPath);
  });
  it('Response object does not match the schema', async () => {
    const response = await request({
      status: 200,
      body: bodyObject.invalid,
      headers: headersObject.valid,
    });

    expect(response).to.be.successful().and.to.not.matchApiSchema(schemaPath);
  });
  it('Response object does not contain method', () => {
    expect(expectationTester({ path: '/pet/123', status: 200, schemaPath }))
      .to.throw('expected request, axios or supertest response object');
  });
  it('Response object does not contain path', () => {
    expect(expectationTester({ method: 'get', status: 200, schemaPath }))
      .to.throw('expected request, axios or supertest response object');
  });
  it('Response object does not contain status', () => {
    expect(expectationTester({ method: 'get', path: '/pet/123', schemaPath }))
      .to.throw('expected request, axios or supertest response object');
  });
  it('Schema path not valid', () => {
    expect(expectationTester({
      method: 'get', path: '/pet/123', status: 200, schemaPath: invalidSchemaPath,
    })).to.throw("ENOENT: no such file or directory, open '/not/a/path'");
  });
  it('Schema file is not contain the request path', () => {
    expect(expectationTester({
      method: 'get', path: '/predators/123', status: 200, schemaPath,
    })).to.throw('schema not found for {"path":"/predators/123","method":"get","status":200}');
  });
  it('Schema file is not contain the request method', () => {
    expect(expectationTester({
      method: 'options', path: '/pet/123', status: 200, schemaPath,
    })).to.throw('schema not found for {"path":"/pet/123","method":"options","status":200}');
  });
  it('Schema file is not contain the response status code', () => {
    expect(expectationTester({
      method: 'get', path: '/pet/123', status: 302, schemaPath,
    })).to.throw('schema not found for {"path":"/pet/123","method":"get","status":302}');
  });
});

function expectationTester({
  path, method, status, schemaPath,
}) {
  return () => expect({ request: { method, path }, statusCode: status }).to.matchApiSchema(schemaPath);
}
