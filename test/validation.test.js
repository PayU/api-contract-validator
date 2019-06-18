const { expect } = require('chai');
const path = require('path');

const { schemaValidator, statusValidator } = require('../lib/index').validators;
const { request } = require('./helpers/response-generator');
const responses = require('./data/responses');

const apiDefinitionsPath = path.join(__dirname, 'data', 'schema.yaml');
const wrongApiDefinitionsPath = '/not/a/path';
const invalidApiDefinitionsPath = path.join(__dirname, 'data', 'invalid-schema.yaml');

describe('Schema validation', () => {
  it('Response headers and body matches the schema', async () => {
    const response = await request({
      status: 200,
      body: responses.body.valid.value,
      headers: responses.headers.valid.value,
    });

    expect(schemaValidator(response, { apiDefinitionsPath })).to.be.like({
      actual: null,
      errors: null,
      expected: null,
      matchMsg: 'expected response to match API schema',
      noMatchMsg: 'expected response to not match API schema',
      predicate: true,
    });
  });

  it('Response headers and body matches the schema with custom Content-Type', async () => {
    const apiDefinitionsPathCustomContentType = path.join(__dirname, 'data', 'schema-custom-content-type.yaml');

    const response = await request({
      status: 200,
      body: responses.body.valid.value,
      headers: responses.headers.valid.value,
    });

    expect(schemaValidator(response, { apiDefinitionsPath: apiDefinitionsPathCustomContentType, buildSchemaOptions: 'application/hal+json' })).to.be.like({
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

    expect(schemaValidator(response, { apiDefinitionsPath })).to.be.like({
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

    expect(schemaValidator(response, { apiDefinitionsPath })).to.be.like({
      predicate: false,
      matchMsg: 'expected response to match API schema',
      noMatchMsg: 'expected response to not match API schema',
      actual: responses.headers.invalid.actual,
      errors: responses.headers.invalid.errors,
      expected: responses.headers.invalid.expected,
    });
  });

  it('Response object does not contain method', () => {
    expect(expectationTester({ path: '/pet/123', status: 200, apiDefinitionsPath }))
      .to.throw("required properties for validating schema are missing: 'method'");
  });

  it('Response object does not contain path', () => {
    expect(expectationTester({ method: 'get', status: 200, apiDefinitionsPath }))
      .to.throw("required properties for validating schema are missing: 'path'");
  });

  it('Response object does not contain status', () => {
    expect(expectationTester({ method: 'get', path: '/pet/123', apiDefinitionsPath }))
      .to.throw("required properties for validating schema are missing: 'status'");
  });

  it('API definitions path is not set', () => {
    expect(expectationTester({
      method: 'get', path: '/pet/123', status: 200,
    })).to.throw("'apiDefinitionsPath' is required");
  });

  it('API definitions path not valid', () => {
    expect(expectationTester({
      method: 'get', path: '/pet/123', status: 200, apiDefinitionsPath: wrongApiDefinitionsPath,
    })).to.throw("ENOENT: no such file or directory, open '/not/a/path'");
  });

  it('Schema not valid', () => {
    expect(expectationTester({
      method: 'get', path: '/pet/123', status: 200, apiDefinitionsPath: invalidApiDefinitionsPath,
    })).to.throw('end of the stream or a document separator is expected');
  });

  it('API definitions file does not contain the request method', () => {
    expect(expectationTester({
      method: 'options', path: '/pet/123', status: 200, apiDefinitionsPath,
    })).to.throw('schema not found for {"path":"/pet/123","method":"options","status":200}');
  });

  it('API definitions file does not contain the response status code', () => {
    expect(expectationTester({
      method: 'get', path: '/pet/123', status: 302, apiDefinitionsPath,
    })).to.throw('schema not found for {"path":"/pet/123","method":"get","status":302}');
  });

  it('apiDefinitionsPath is missing', () => {
    expect(() => schemaValidator()).to.throw("'apiDefinitionsPath' is required");
  });

  it('API definitions file does not contain the response status code', () => {
    expect(() => schemaValidator(undefined, { apiDefinitionsPath }))
      .to.throw('failed to extract response details');
  });

  it('API definitions file does not contain the request path', () => {
    expect(expectationTester({
      method: 'get', path: '/pet/123/test', status: 200, apiDefinitionsPath,
    })).to.throw('schema not found for {"path":"/pet/123/test","method":"get","status":200}');
    expect(expectationTester({
      method: 'get', path: '/pet', status: 200, apiDefinitionsPath,
    })).to.throw('schema not found for {"path":"/pet","method":"get","status":200}');
    expect(expectationTester({
      method: 'get', path: '/predators/123', status: 200, apiDefinitionsPath,
    })).to.throw('schema not found for {"path":"/predators/123","method":"get","status":200}');
  });

  it('successful status code match', async () => {
    const response = await request({ status: 200, body: responses.body.valid.value });
    expect(statusValidator(200, response)).to.eql({
      predicate: true,
      actual: {
        body: responses.body.valid.value,
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
    const response = await request({ status: 204, body: responses.body.valid.value });
    expect(statusValidator(200, response)).to.eql({
      predicate: false,
      actual: {
        body: responses.body.valid.value,
        status: 204,
      },
      expected: {
        status: 200,
      },
      matchMsg: 'expected http status code 204 to be 200',
      noMatchMsg: 'expected http status code 204 to not be 200',
    });
  });
});

function expectationTester({
  path, method, status, apiDefinitionsPath,
}) {
  return function matchApiSchema() {
    const response = {
      request: { method, path },
      statusCode: status,
    };
    schemaValidator(response, { apiDefinitionsPath });
  };
}
