const { expect } = require('chai');
const path = require('path');

const { schemaValidator, statusValidator } = require('../lib/index').validators;
const { request } = require('./helpers/response-generator');
const responses = require('./data/responses');

const schemaPath = path.join(__dirname, 'data', 'schema.yaml');
const invalidSchemaPath = '/not/a/path';
const invalidSchemaContentPath = path.join(__dirname, 'data', 'invalid-schema.yaml');


describe('Schema validation', () => {
  it('Response headers and body matches the schema', async () => {
    const response = await request({
      status: 200,
      body: responses.body.valid.value,
      headers: responses.headers.valid.value,
    });

    expect(schemaValidator(schemaPath, response)).to.be.like({
      actual: null,
      errors: null,
      expected: null,
      matchMsg: 'expected response to match API schema',
      noMatchMsg: 'expected response to not match API schema',
      predicate: true,
    });
  });
  it('Response body does not match the schema', async () => {
    const response = await request({
      status: 200,
      body: responses.body.invalid.value,
      headers: responses.headers.valid.value,
    });

    expect(schemaValidator(schemaPath, response)).to.be.like({
      predicate: false,
      matchMsg: 'expected response to match API schema',
      noMatchMsg: 'expected response to not match API schema',
      actual: responses.body.invalid.actual,
      errors: responses.body.invalid.errors,
      expected: responses.body.invalid.expected,
    });
  });
  it('Response headers does not match the schema', async () => {
    const response = await request({
      status: 200,
      body: responses.body.valid.value,
      headers: responses.headers.invalid.value,
    });

    expect(schemaValidator(schemaPath, response)).to.be.like({
      predicate: false,
      matchMsg: 'expected response to match API schema',
      noMatchMsg: 'expected response to not match API schema',
      actual: responses.headers.invalid.actual,
      errors: responses.headers.invalid.errors,
      expected: responses.headers.invalid.expected,
    });
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
  it('Schema not valid', () => {
    expect(expectationTester({
      method: 'get', path: '/pet/123', status: 200, schemaPath: invalidSchemaContentPath,
    })).to.throw(`Error parsing ${invalidSchemaContentPath}`);
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
  it('Schema file does not contain the request path', () => {
    expect(expectationTester({
      method: 'get', path: '/pet/123/test', status: 200, schemaPath,
    })).to.throw('schema not found for {"path":"/pet/123/test","method":"get","status":200}');

    expect(expectationTester({
      method: 'get', path: '/pet', status: 200, schemaPath,
    })).to.throw('schema not found for {"path":"/pet","method":"get","status":200}');

    expect(expectationTester({
      method: 'get', path: '/predators/123', status: 200, schemaPath,
    })).to.throw('schema not found for {"path":"/predators/123","method":"get","status":200}');
  });
  it('successful status code match', async () => {
    const response = await request({ status: 200 });
    expect(statusValidator(200, response)).to.eql({
      predicate: true,
      actual: {
        body: {},
        status: 200,
      },
      expected: {
        status: 200,
      },
      matchMsg: 'expected http status code 200 to be 200',
      noMatchMsg: 'expected http status code 200 to not be 200',
    });
  });
  it('unsuccessful status code match', async () => {
    const response = await request({ status: 204 });
    expect(statusValidator(200, response)).to.eql({
      predicate: false,
      actual: {
        body: {},
        status: 204,
      },
      expected: {
        status: 200,
      },
      matchMsg: 'expected http status code 204 to be 200',
      noMatchMsg: 'expected http status code 204 to not be 200',
    });
  });
  it('Invalid response object', () => {
    expect(() => statusValidator(200, { statusCode: undefined })).to.throw('expected request, axios or supertest response object');
    expect(() => statusValidator(200, { statusCode: null })).to.throw('expected request, axios or supertest response object');
    expect(() => statusValidator(200, { statusCode: '' })).to.throw('expected request, axios or supertest response object');
    expect(() => statusValidator(200, { statusCode: {} })).to.throw('expected request, axios or supertest response object');
  });
});

function expectationTester({
  path, method, status, schemaPath,
}) {
  return function matchApiSchema() {
    schemaValidator(schemaPath, { request: { method, path }, statusCode: status });
  };
}
